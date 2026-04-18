# Implementation Plan - Local Code Reviewer

A local-first, AI-powered code review tool using Ollama for language-specific analysis of git diffs and files.

## User Review Required

> [!IMPORTANT]
> This application requires **Ollama** to be installed and running on the local machine. The tool will support multiple models including **Qwen**, **Gemma**, **Llama3**, and **CodeLlama**.

> [!WARNING]
> Multi-pass reviews (Pass 1: Correctness/Security, Pass 2: Design/SOLID) will increase processing time but provide significantly higher quality feedback.

## Proposed Architecture

We will use a modular TypeScript-based structure to share logic between the CLI, API, and UI.

### Project Structure
```text
local-reviewer/
├── packages/
│   ├── core/           # Shared logic, AI service, prompt templates, Zod schemas
│   ├── cli/            # Commander-based CLI tool
│   ├── api/            # Fastify server for the Web UI
│   └── web/            # Next.js frontend
├── rules/              # Language-specific JSON/TS rules
└── examples/           # Sample diffs for testing
```

### Components

#### [NEW] [Core Engine](file:///d:/Projects/Idea/Local-Code-Reviewer/packages/core)
- `OllamaClient`: Wrapper around Ollama SDK.
- `PromptBuilder`: Generates multi-pass prompts.
- `ReviewEngine`: Orchestrates the passes and merges findings.

#### [NEW] [CLI Tool](file:///d:/Projects/Idea/Local-Code-Reviewer/packages/cli)
- Syntax: `reviewer review <path|diff>`
- Support for piping: `git diff | reviewer`

#### [NEW] [Backend API](file:///d:/Projects/Idea/Local-Code-Reviewer/packages/api)
- Endpoint for uploading diffs and proxying to Ollama.

#### [NEW] [Web UI](file:///d:/Projects/Idea/Local-Code-Reviewer/packages/web)
- Modern Next.js dashboard with findings grouped by severity and category.

## Proposed Phases

1.  **Phase 1: Foundation & Core**
    - Set up project structure and dependencies.
    - Implement `OllamaClient` and structured prompt templates.
2.  **Phase 2: CLI Development**
    - Implement the CLI interface and `ReviewEngine` logic.
3.  **Phase 3: Backend & Web UI**
    - Build the Fastify server and Next.js frontend.
4.  **Phase 4: Optimization & Polish**
    - Finalize "Premium" design aesthetics and documentation.

## Open Questions

- **Persistent Data**: Do you want a local SQLite database for history, or should it be purely session-based for the MVP?
- **Structure**: I will proceed with a **standalone TypeScript project** structure for ease of setup, unless you prefer a monorepo.

## Verification Plan

### Manual Verification
1.  Run `git diff` on a sample repo with intentionally bad code.
2.  Pipe to CLI and verify JSON output.
3.  Upload the same diff to Web UI and verify UI grouping/filtering.
