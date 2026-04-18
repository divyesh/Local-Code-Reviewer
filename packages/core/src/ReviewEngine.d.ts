import { OllamaClient } from './OllamaClient.js';
import { ReviewResult } from './types.js';
export declare class ReviewEngine {
    private client;
    constructor(client: OllamaClient);
    runMultiPassReview(diff: string): Promise<ReviewResult>;
    private mergeResults;
}
