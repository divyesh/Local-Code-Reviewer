import { readdirSync, statSync, readFileSync } from 'fs';
import path from 'path';

export interface SymbolInfo {
  name: string;
  type: 'class' | 'interface' | 'method' | 'type';
  file: string;
  signature?: string;
}

export class WorkspaceIndexer {
  private symbols: SymbolInfo[] = [];
  private ignoreDirs = ['node_modules', '.git', 'bin', 'obj', '.vs', 'dist', 'vendor', 'target', '.next'];
  private supportedExts = ['.ts', '.js', '.py', '.java', '.cs'];

  async indexWorkspace(dirPath: string): Promise<SymbolInfo[]> {
    this.symbols = [];
    this.scanDir(dirPath, dirPath);
    return this.symbols;
  }

  private scanDir(currentPath: string, rootPath: string) {
    const files = readdirSync(currentPath);

    for (const file of files) {
      if (this.ignoreDirs.includes(file)) continue;

      const fullPath = path.join(currentPath, file);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        this.scanDir(fullPath, rootPath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (this.supportedExts.includes(ext)) {
          this.indexFile(fullPath, rootPath, ext);
        }
      }
    }
  }

  private indexFile(filePath: string, rootPath: string, ext: string) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(rootPath, filePath);

      if (ext === '.cs') {
        this.parseCSharp(content, relativePath);
      } else if (ext === '.ts' || ext === '.js') {
        this.parseTypeScript(content, relativePath);
      } else if (ext === '.py') {
        this.parsePython(content, relativePath);
      }
    } catch (err) {
      // Skip files that can't be read
    }
  }

  private parseCSharp(content: string, file: string) {
    // Basic regex for class/interface
    const classMatches = content.matchAll(/(?:public|internal)\s+(?:class|interface|record|struct)\s+(\w+)/g);
    for (const match of classMatches) {
      this.symbols.push({ name: match[1], type: 'class', file });
    }

    // Basic regex for public methods
    const methodMatches = content.matchAll(/public\s+(?:static\s+|async\s+)*([\w<>[\]]+)\s+(\w+)\s*\(([^)]*)\)/g);
    for (const match of methodMatches) {
      this.symbols.push({ 
        name: match[2], 
        type: 'method', 
        file, 
        signature: `public ${match[1]} ${match[2]}(${match[3]})`
      });
    }
  }

  private parseTypeScript(content: string, file: string) {
    const entityMatches = content.matchAll(/export\s+(?:class|interface|type|enum)\s+(\w+)/g);
    for (const match of entityMatches) {
      this.symbols.push({ name: match[1], type: 'class', file });
    }

    // TS Public methods in classes
    const methodMatches = content.matchAll(/public\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*([\w<>[\]]+))?/g);
    for (const match of methodMatches) {
      this.symbols.push({ 
        name: match[1], 
        type: 'method', 
        file, 
        signature: `public ${match[1]}(${match[2]}): ${match[3] || 'any'}`
      });
    }
  }

  private parsePython(content: string, file: string) {
    const classMatches = content.matchAll(/class\s+(\w+)(?:\([^)]*\))?:/g);
    for (const match of classMatches) {
      this.symbols.push({ name: match[1], type: 'class', file });
    }

    const funcMatches = content.matchAll(/def\s+(\w+)\(([^)]*)\)(?:\s*->\s*([^:]+))?:/g);
    for (const match of funcMatches) {
      this.symbols.push({ 
        name: match[1], 
        type: 'method', 
        file, 
        signature: `def ${match[1]}(${match[2]})${match[3] ? ' -> ' + match[3] : ''}`
      });
    }
  }

  getSymbolSummary(): string {
    const classes = this.symbols.filter(s => s.type === 'class').map(s => s.name);
    const methods = this.symbols.filter(s => s.type === 'method').map(s => s.signature);
    
    return `
Available Classes: ${classes.slice(0, 50).join(', ')}${classes.length > 50 ? '...' : ''}
Signature Highlights:
${methods.slice(0, 20).join('\n')}
    `.trim();
  }
}
