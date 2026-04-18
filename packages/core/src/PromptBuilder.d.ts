export declare class PromptBuilder {
    static buildSystemPrompt(): string;
    static buildPass1Prompt(diff: string): string;
    static buildPass2Prompt(diff: string): string;
    static buildLanguageSpecificRules(language: string): string;
}
