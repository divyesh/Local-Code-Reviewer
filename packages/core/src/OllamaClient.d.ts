import { ReviewResult } from './types.js';
export interface OllamaOptions {
    model?: string;
    host?: string;
}
export declare class OllamaClient {
    private model;
    private host;
    constructor(options?: OllamaOptions);
    review(prompt: string, systemPrompt: string): Promise<ReviewResult>;
    setModel(model: string): void;
}
