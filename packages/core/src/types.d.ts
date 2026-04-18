import { z } from "zod";
export declare const SeveritySchema: z.ZodEnum<["low", "medium", "high", "critical"]>;
export declare const CategorySchema: z.ZodEnum<["correctness", "solid", "design-pattern", "maintainability", "security", "performance", "language-specific"]>;
export declare const ConfidenceSchema: z.ZodEnum<["low", "medium", "high"]>;
export declare const LanguageSchema: z.ZodEnum<["csharp", "typescript", "javascript", "python", "java", "unknown"]>;
export declare const FindingSchema: z.ZodObject<{
    category: z.ZodEnum<["correctness", "solid", "design-pattern", "maintainability", "security", "performance", "language-specific"]>;
    severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
    confidence: z.ZodEnum<["low", "medium", "high"]>;
    language: z.ZodEnum<["csharp", "typescript", "javascript", "python", "java", "unknown"]>;
    rule_hint: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    title: z.ZodString;
    file: z.ZodString;
    explanation: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    suggestion: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    category: "correctness" | "solid" | "design-pattern" | "maintainability" | "security" | "performance" | "language-specific";
    severity: "low" | "medium" | "high" | "critical";
    confidence: "low" | "medium" | "high";
    language: "csharp" | "typescript" | "javascript" | "python" | "java" | "unknown";
    rule_hint: string;
    title: string;
    file: string;
    explanation: string;
    suggestion: string;
}, {
    category: "correctness" | "solid" | "design-pattern" | "maintainability" | "security" | "performance" | "language-specific";
    severity: "low" | "medium" | "high" | "critical";
    confidence: "low" | "medium" | "high";
    language: "csharp" | "typescript" | "javascript" | "python" | "java" | "unknown";
    title: string;
    file: string;
    rule_hint?: string | undefined;
    explanation?: string | undefined;
    suggestion?: string | undefined;
}>;
export declare const ReviewResultSchema: z.ZodObject<{
    verdict: z.ZodDefault<z.ZodOptional<z.ZodEnum<["pass", "warn", "fail"]>>>;
    summary: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    findings: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodAny, "many">>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    verdict: z.ZodDefault<z.ZodOptional<z.ZodEnum<["pass", "warn", "fail"]>>>;
    summary: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    findings: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodAny, "many">>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    verdict: z.ZodDefault<z.ZodOptional<z.ZodEnum<["pass", "warn", "fail"]>>>;
    summary: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    findings: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodAny, "many">>>;
}, z.ZodTypeAny, "passthrough">>;
export type Severity = z.infer<typeof SeveritySchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Confidence = z.infer<typeof ConfidenceSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Finding = z.infer<typeof FindingSchema>;
export type ReviewResult = z.infer<typeof ReviewResultSchema>;
