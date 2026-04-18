import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { OllamaClient, ReviewEngine, WorkspaceIndexer, CacheManager } from '@local-reviewer/core';
import { readFileSync, statSync, readdirSync } from 'fs';
import path from 'path';

const SUPPORTED_EXTENSIONS = ['.ts', '.js', '.py', '.java', '.cs'];
const IGNORE_DIRS = ['node_modules', '.git', 'bin', 'obj', '.vs', 'dist', 'vendor', 'target', '.next'];

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (SUPPORTED_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const program = new Command();

program
  .name('reviewer')
  .description('Local-first AI-powered code reviewer')
  .version('1.0.0');

program
  .command('review')
  .description('Review a git diff, file, or folder')
  .argument('[path]', 'Path to a diff file, a source file, or a directory')
  .option('-m, --model <model>', 'Ollama model to use', 'qwen')
  .option('-b, --best-practices', 'Check against industry best practices (GoF, Clean Code, etc.)', false)
  .option('-c, --concurrency <number>', 'Number of simultaneous files to review', '1')
  .option('--host <url>', 'Ollama host URL', 'http://localhost:11434')
  .option('--no-cache', 'Disable file caching', false)
  .option('--stdin', 'Read diff from stdin')
  .action(async (targetPath, options) => {
    const client = new OllamaClient({ model: options.model, host: options.host });
    const engine = new ReviewEngine(client);
    const indexer = new WorkspaceIndexer();
    const concurrency = parseInt(options.concurrency) || 1;
    const useCache = options.cache !== false;

    const bestPractices = !!options.bestPractices;
    let symbolSummary: string | undefined;
    let cacheManager: CacheManager | undefined;

    if (targetPath && !options.stdin) {
      const fullPath = path.resolve(targetPath);
      const indexDir = statSync(fullPath).isDirectory() ? fullPath : path.dirname(fullPath);
      
      const indexSpinner = ora(`Indexing project symbols in ${indexDir}...`).start();
      try {
        await indexer.indexWorkspace(indexDir);
        symbolSummary = indexer.getSymbolSummary();
        indexSpinner.succeed(`Indexing complete!`);
      } catch (err) {
        indexSpinner.warn('Indexing failed. Continuing without workspace context.');
      }

      if (useCache) {
        cacheManager = new CacheManager(indexDir);
      }
    }

    if (options.stdin) {
      const diff = readFileSync(0, 'utf-8');
      if (!diff.trim()) {
        console.error(chalk.yellow('Warning: Empty stdin provided.'));
        return;
      }
      await runFileReview('stdin', diff, engine, options.model, symbolSummary, bestPractices);
    } else if (targetPath) {
      const fullPath = path.resolve(targetPath);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        const files = getAllFiles(fullPath);
        console.log(chalk.blue(`\n🔍 Found ${files.length} files to review in ${targetPath}`));
        if (useCache) console.log(chalk.gray(`📊 Cache enabled. Skipping unchanged files...\n`));

        // Process in batches (Parallel)
        for (let i = 0; i < files.length; i += concurrency) {
          const batch = files.slice(i, i + concurrency);
          await Promise.all(batch.map(async (file, batchIdx) => {
            const idx = i + batchIdx;
            const relativePath = path.relative(fullPath, file);
            
            try {
              const content = readFileSync(file, 'utf-8');
              
              // Cache check
              let cachedResult = null;
              if (cacheManager) {
                cachedResult = cacheManager.getCachedResult(relativePath, content);
              }

              if (cachedResult) {
                console.log(chalk.dim(`\n[${idx + 1}/${files.length}] (Cached) Skipping: ${relativePath}`));
                displayReviewResult(relativePath, cachedResult);
                return;
              }

              console.log(chalk.gray(`\n[${idx + 1}/${files.length}] Reviewing: ${relativePath}`));
              const result = await runFileReview(relativePath, content, engine, options.model, symbolSummary, bestPractices);
              
              if (cacheManager && result) {
                cacheManager.setCachedResult(relativePath, content, result);
              }
            } catch (err: any) {
              console.error(chalk.red(`  × Failed to review ${file}: ${err.message}`));
            }
          }));
        }

        if (cacheManager) cacheManager.saveCache();

      } else {
        const content = readFileSync(fullPath, 'utf-8');
        await runFileReview(targetPath, content, engine, options.model, symbolSummary, bestPractices);
      }
    } else {
      process.exit(1);
    }
  });

function displayReviewResult(fileName: string, result: any) {
  const verdictLabel = result.verdict === 'pass' ? chalk.green('PASS') : result.verdict === 'warn' ? chalk.yellow('WARN') : chalk.red('FAIL');
  console.log(`  ${chalk.bold('Verdict:')} ${verdictLabel}`);
  
  if (result.findings && result.findings.length > 0) {
    result.findings.forEach((finding: any, index: number) => {
      console.log(`\n  ${chalk.bold(index + 1 + '.')} ${formatSeverity(finding.severity)} ${chalk.bold(finding.title)}`);
      console.log(`  ${chalk.gray('  Explanation:')} ${finding.explanation}`);
      console.log(`  ${chalk.green('  Suggestion:')} ${finding.suggestion}`);
    });
  } else {
    console.log(`  ${chalk.green('✔ No issues found.')}`);
  }
}

async function runFileReview(fileName: string, content: string, engine: ReviewEngine, model: string, symbolSummary?: string, bestPractices: boolean = false) {
  const spinner = ora(`Analyzing ${fileName}...`).start();
  
  try {
    const result = await engine.runMultiPassReview(content, symbolSummary, bestPractices, (passName) => {
      spinner.text = `Analyzing ${fileName} - ${chalk.cyan(passName)}...`;
    });
    spinner.stop();
    displayReviewResult(fileName, result);
    return result;
  } catch (error) {
    spinner.fail(`Review failed for ${fileName}`);
    console.error(chalk.red(`  Error: ${error instanceof Error ? error.message : String(error)}`));
    return null;
  }
}

function formatVerdict(verdict: string) {
  switch (verdict) {
    case 'pass': return chalk.green('PASS');
    case 'warn': return chalk.yellow('WARN');
    case 'fail': return chalk.red('FAIL');
    default: return verdict;
  }
}

function formatSeverity(severity: string) {
  const box = '●';
  switch (severity) {
    case 'critical': return chalk.bgRed.white(` ${box} CRITICAL `);
    case 'high': return chalk.red(`${box} HIGH`);
    case 'medium': return chalk.yellow(`${box} MEDIUM`);
    case 'low': return chalk.blue(`${box} LOW`);
    default: return severity;
  }
}

program.parse();
