# Features - Local Code Reviewer

The Local Code Reviewer is a production-ready, local-first AI toolkit designed to improve code quality without sending data to the cloud.

## 🚀 Existing Features

### 1. Multi-Pass AI Review Engine
- Uses **Ollama** locally (e.g., Qwen, Gemma, Llama3).
- **Pass 1: Correctness & Security**: Finds logic bugs, resource leaks, and security vulnerabilities.
- **Pass 2: SOLID & Design**: Detects architectural smells, design pattern opportunities, and clean code violations.

### 2. Workspace-Aware Intelligence (Context)
- Performs a **Project-Wide Symbol Scan** before reviews.
- Indexes **Class Names**, **Interfaces**, and **Public Method Signatures**.
- Injects this context into the AI, allowing it to "understand" cross-file relationships just like an IDE.

### 3. Professional CLI Tool
- Support for **Single Files**, **Piped Diffs** (`git diff | reviewer`), and **Whole Folders**.
- **Recursive Scan**: Deep-dives into folders, automatically ignoring `node_modules`, `bin`, and `obj`.
- **Real-time Reporting**: Shows findings immediately as they are generated.

### 4. Enterprise-Grade API
- Fastify-based backend that proxies review requests.
- Integrated **Headers Timeout Handler** (10-minute capacity) for analyzing complex codebases.

### 5. Web Dashboard
- Next.js-powered dashboard with a premium dark-mode UI.
- Visual summary of verdicts and color-coded findings.

### 6. Multi-Language Support
- Optimized for **C#**, **TypeScript**, **JavaScript**, and **Python**.
