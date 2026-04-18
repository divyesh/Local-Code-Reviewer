import { OllamaClient } from './OllamaClient.js';
import { PromptBuilder } from './PromptBuilder.js';
import { ReviewResult, Finding } from './types.js';

export class ReviewEngine {
  private client: OllamaClient;

  constructor(client: OllamaClient) {
    this.client = client;
  }

  async runMultiPassReview(
    diff: string, 
    symbolMap?: string, 
    checkBestPractices: boolean = false,
    onProgress?: (passName: string) => void
  ): Promise<ReviewResult> {
    const systemPrompt = PromptBuilder.buildSystemPrompt(symbolMap);
    
    // Run Pass 1 (Correctness/Security)
    onProgress?.('Pass 1: Correctness & Security');
    const pass1Prompt = PromptBuilder.buildPass1Prompt(diff);
    const pass1Result = await this.client.review(pass1Prompt, systemPrompt);

    // Run Pass 2 (Clean Architecture/SOLID)
    onProgress?.('Pass 2: Clean Architecture & SOLID');
    const pass2Prompt = PromptBuilder.buildPass2Prompt(diff);
    const pass2Result = await this.client.review(pass2Prompt, systemPrompt);

    let finalResult = this.mergeResults(pass1Result, pass2Result);

    // Run Pass 3 (Best Practices) - Optional
    if (checkBestPractices) {
      onProgress?.('Pass 3: Best Programming Practices');
      const pass3Prompt = PromptBuilder.buildBestPracticesPrompt(pass1Result.findings?.[0]?.language || 'unknown');
      const pass3Result = await this.client.review(pass3Prompt, systemPrompt);
      
      // Override pass3 verdict to 'warn' if it failed (we don't fail just for style)
      if (pass3Result.verdict === 'fail') pass3Result.verdict = 'warn';
      
      finalResult = this.mergeResults(finalResult, pass3Result);
    }

    return finalResult;
  }

  private mergeResults(r1: ReviewResult, r2: ReviewResult): ReviewResult {
    const mergedFindings: Finding[] = [...r1.findings, ...r2.findings];
    
    // Determine overall verdict
    const verdicts = [r1.verdict, r2.verdict];
    let finalVerdict: ReviewResult['verdict'] = 'pass';
    if (verdicts.includes('fail')) finalVerdict = 'fail';
    else if (verdicts.includes('warn')) finalVerdict = 'warn';

    return {
      verdict: finalVerdict,
      summary: `${r1.summary}\n\n${r2.summary}`,
      findings: mergedFindings,
    };
  }
}
