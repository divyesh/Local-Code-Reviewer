# Roadmap - Local Code Reviewer

Future development goals for the Local Code Reviewer project.

## 🛠️ Upcoming Features

### 1. VS Code Extension (High Priority)
- **Editor Integration**: Squiggles (Diagnostics) directly in the code for AI-detected issues.
- **Hover Suggestions**: Hover over a class to see AI-generated architectural summaries.
- **Side Panels**: A "Review Summary" view in the VS Code sidebar.

### 2. Automated Unit Test Generation
- **Smart Mocks**: Automatically generate xUnit/NUnit tests for C# services with mocked dependencies.
- **Test-Driven AI**: Use the AI to fix failing tests it detects.

### 3. Git & CI/CD Integration
- **PR Review Bot**: Integrate as a GitHub Action or local pre-commit hook.
- **Diff Analysis**: Optimized logic to review *only* the changes in a specific branch.

### 4. Advanced Language Support
- Expanded support for **Java**, **Go**, and **Rust**.
- Deep integration with language-specific linters.

### 5. Enhanced Intelligence
- **RAG-based Indexing**: Use vector databases to allow the AI to "search" your entire codebase for similar patterns.
- **Graph Knowledge Integration**: Build a call graph to understand the "blast radius" of code changes.
