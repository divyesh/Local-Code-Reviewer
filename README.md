# Local Code Reviewer 🛡️

A production-ready, local-first AI-powered code review tool. Uses local LLMs via **Ollama** to analyze git diffs for correctness, security, design patterns, and SOLID principles.

## Features
- **Ollama Integration**: Uses `qwen`, `gemma`, `llama3`, etc.
- **Multi-Pass Review**:
  - Pass 1: Correctness & Security.
  - Pass 2: SOLID & Design Patterns.
- **CLI Tool**: Pipe git diffs directly (`git diff | reviewer`).
- **Modern Web UI**: interactive dashboard with severity grouping and suggestions.
- **Privacy Focused**: No data leaves your machine.

## Prerequisites
1. **Ollama**: [Install here](https://ollama.com/)
2. **Models**:
   ```bash
   ollama pull qwen
   ollama pull gemma
   ```
3. **Node.js**: v18+

## 🛠️ CLI Usage Guide

### 1. Installation
To use the `reviewer` command from any folder on your machine, run:
```bash
cd packages/cli
npm link
```

### 2. Reviewing Code

#### Review a Single File
Analyze a specific source file for correctness and architecture:
```bash
reviewer review ./path/to/File.cs
```

#### Review a Whole Folder (Recursive)
Analyze all supported files in a directory (automatically ignores `bin`, `obj`, `node_modules`):
```bash
reviewer review ./src/Services
```

#### Multi-Pass Deep Audit (Best Practices)
Run an extra pass to check against **GoF Design Patterns**,and **Clean Code**:
```bash
reviewer review ./src --best-practices
```

#### Pipeline from Git (PR Review mode)
Review only your staged changes before committing:
```bash
git diff --staged | reviewer review --stdin
```

### 3. Options
- `-m, --model`: Change the Ollama model (default: `qwen`).
- `-b, --best-practices`: Enable the 3rd pass for industry standards.
- `--stdin`: Read code from standard input.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the CLI
```bash
# Review a diff file
node packages/cli/bin/reviewer.js review examples/sample.diff

# Or pipe from git
git diff | node packages/cli/bin/reviewer.js review --stdin
```

### 3. Start the Web UI & Backend
```bash
# In Terminal 1 (Backend)
npm run start

# In Terminal 2 (Web UI)
npm run dev
```
- API: [http://localhost:3001](http://localhost:3001)
- UI: [http://localhost:3000](http://localhost:3000)

## Architecture
- `packages/core`: The AI engine and prompt logic.
- `packages/cli`: Commander-based command line interface.
- `packages/api`: Fastify backend proxying to Ollama.
- `packages/web`: Next.js frontend dashboard.

## Extending the System
- **Rules**: Add language-specific rules in `packages/core/src/PromptBuilder.ts`.
- **Models**: Configure different models in the CLI via `--model`.
