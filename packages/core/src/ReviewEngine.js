import { PromptBuilder } from './PromptBuilder.js';
export class ReviewEngine {
    client;
    constructor(client) {
        this.client = client;
    }
    async runMultiPassReview(diff, symbolMap, checkBestPractices = false) {
        const systemPrompt = PromptBuilder.buildSystemPrompt(symbolMap);
        // Run Pass 1 (Correctness/Security)
        const pass1Prompt = PromptBuilder.buildPass1Prompt(diff);
        const pass1Result = await this.client.review(pass1Prompt, systemPrompt);
        // Run Pass 2 (Clean Architecture/SOLID)
        const pass2Prompt = PromptBuilder.buildPass2Prompt(diff);
        const pass2Result = await this.client.review(pass2Prompt, systemPrompt);
        let finalResult = this.mergeResults(pass1Result, pass2Result);
        // Run Pass 3 (Best Practices) - Optional
        if (checkBestPractices) {
            // Basic language detection from diff (simplified)
            const language = diff.includes('.cs') ? 'csharp' : (diff.includes('.ts') || diff.includes('.js')) ? 'typescript' : 'general';
            const bestPracticesPrompt = PromptBuilder.buildBestPracticesPrompt(language);
            const pass3Result = await this.client.review(bestPracticesPrompt, systemPrompt);
            // Override pass3 verdict to 'warn' if it failed (we don't fail just for style)
            if (pass3Result.verdict === 'fail')
                pass3Result.verdict = 'warn';
            finalResult = this.mergeResults(finalResult, pass3Result);
        }
        return finalResult;
    }
    mergeResults(r1, r2) {
        const mergedFindings = [...r1.findings, ...r2.findings];
        // Determine overall verdict
        const verdicts = [r1.verdict, r2.verdict];
        let finalVerdict = 'pass';
        if (verdicts.includes('fail'))
            finalVerdict = 'fail';
        else if (verdicts.includes('warn'))
            finalVerdict = 'warn';
        return {
            verdict: finalVerdict,
            summary: `${r1.summary}\n\n${r2.summary}`,
            findings: mergedFindings,
        };
    }
}
//# sourceMappingURL=ReviewEngine.js.map