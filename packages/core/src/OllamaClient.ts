import { Ollama } from 'ollama';
import chalk from 'chalk';
import { fetch as undiciFetch, Agent } from 'undici';
import { ReviewResult, ReviewResultSchema } from './types.js';

export interface OllamaOptions {
  model?: string;
  host?: string;
}

export class OllamaClient {
  private ollama: Ollama;
  private model: string;

  constructor(options: OllamaOptions = {}) {
    this.model = options.model || 'qwen';
    const host = options.host || 'http://localhost:11434';

    // Increase timeout significantly to handle large models/slow local LLMs
    const customDispatcher = new Agent({
      headersTimeout: 20 * 60 * 1000,
      bodyTimeout: 20 * 60 * 1000,
      connectTimeout: 60 * 1000,
    });

    const customFetch = (input: any, init: any) => {
      return undiciFetch(input, {
        ...init,
        dispatcher: customDispatcher,
      });
    };

    this.ollama = new Ollama({
      host,
      fetch: customFetch as any,
    });
  }

  async review(prompt: string, systemPrompt: string): Promise<ReviewResult> {
    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        format: 'json',
        stream: false,
      });

      console.log(chalk.gray(`\n[DEBUG] Raw AI response length: ${response.message.content.length}`));
      
      try {
        const parsed = JSON.parse(response.message.content);
        // Validate with Zod
        const validationResult = ReviewResultSchema.safeParse(parsed);
        if (!validationResult.success) {
          console.error(chalk.red('\n[DEBUG] Zod Validation Failed:'), JSON.stringify(validationResult.error.format(), null, 2));
          console.error(chalk.gray('[DEBUG] Raw Parsed JSON:'), JSON.stringify(parsed, null, 2));
          throw validationResult.error;
        }
        return validationResult.data;
      } catch (parseError) {
        console.error(chalk.red('\n[DEBUG] AI Response Detail:'), response.message.content);
        throw parseError;
      }
    } catch (error) {
      console.error('Ollama Review Error:', error);
      throw new Error(`Failed to get a valid review from Ollama: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  setModel(model: string) {
    this.model = model;
  }
}
