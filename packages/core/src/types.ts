import { z } from "zod";

export const SeveritySchema = z.enum(["low", "medium", "high", "critical"]);
export const CategorySchema = z.enum([
  "correctness",
  "solid",
  "design-pattern",
  "maintainability",
  "security",
  "performance",
  "language-specific",
]);
export const ConfidenceSchema = z.enum(["low", "medium", "high"]);
export const LanguageSchema = z.enum([
  "csharp",
  "typescript",
  "javascript",
  "python",
  "java",
  "unknown",
]);

export const FindingSchema = z.object({
  category: CategorySchema,
  severity: SeveritySchema,
  confidence: ConfidenceSchema,
  language: LanguageSchema,
  line: z.number().optional().default(1),
  column: z.number().optional().default(1),
  rule_hint: z.string().optional().default(""),
  title: z.string(),
  file: z.string(),
  explanation: z.string().optional().default(""),
  suggestion: z.string().optional().default(""),
});

export const ReviewResultSchema = z.object({
  verdict: z.enum(["pass", "warn", "fail"]).optional().default("pass"),
  summary: z.string().optional().default(""),
  findings: z.array(z.any()).optional().default([]),
}).passthrough();

export type Severity = z.infer<typeof SeveritySchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Confidence = z.infer<typeof ConfidenceSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Finding = z.infer<typeof FindingSchema>;
export type ReviewResult = z.infer<typeof ReviewResultSchema>;
