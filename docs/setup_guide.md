# Setup Guide: Local Code Reviewer

Follow these steps to get your environment ready for the **Local Code Reviewer**.

## 1. Install Ollama
**Yes**, you must install Ollama as it serves the local models used for code review.
- **Download**: [ollama.com/download](https://ollama.com/download)
- **Install**: Follow the installer instructions for Windows.
- **Verify**: Open PowerShell and run:
  ```powershell
  ollama --version
  ```

## 2. Pull Required Models
Once Ollama is installed, you need to download the models. We will use `qwen` and `gemma` as requested.
- Run these commands in your terminal:
  ```powershell
  ollama pull qwen
  ollama pull gemma
  ```

## 3. Node.js Environment
Ensure you have Node.js installed (v18 or higher recommended).
- **Verify**:
  ```powershell
  node --version
  ```

## 4. Project Installation (Coming Soon)
I will begin implementing the project structure now.

---

> [!TIP]
> Keep Ollama running in the background. The application will connect to it via `http://localhost:11434`.
