import * as vscode from 'vscode';
import { OllamaClient, ReviewEngine, WorkspaceIndexer, ReviewResult } from '@local-reviewer/core';

let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
    console.log('Local AI Reviewer is now active!');

    diagnosticCollection = vscode.languages.createDiagnosticCollection('localReviewer');
    context.subscriptions.push(diagnosticCollection);

    let disposable = vscode.commands.registerCommand('localReviewer.reviewFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found.');
            return;
        }

        const document = editor.document;
        const fileName = document.fileName;
        const content = document.getText();

        // 1. Show Progress
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `AI Reviewing: ${vscode.workspace.asRelativePath(fileName)}`,
            cancellable: false
        }, async (progress) => {
            try {
                // 2. Initialize Engine
                const client = new OllamaClient({ model: 'qwen' }); // Default to qwen
                const engine = new ReviewEngine(client);
                const indexer = new WorkspaceIndexer();

                // 3. Optional: Index Workspace Context
                progress.report({ message: 'Indexing workspace context...' });
                const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
                let symbolSummary: string | undefined;
                
                if (workspaceFolder) {
                    await indexer.indexWorkspace(workspaceFolder.uri.fsPath);
                    symbolSummary = indexer.getSymbolSummary();
                }

                // 4. Run Review
                progress.report({ message: 'Analyzing code (Multi-pass)...' });
                const result = await engine.runMultiPassReview(content, symbolSummary, true); // Always run best practices in IDE

                // 5. Update UI
                updateDiagnostics(document, result);
                
                if (result.verdict === 'pass') {
                    vscode.window.showInformationMessage(`Review complete: No major issues found! 🎉`);
                } else {
                    vscode.window.showWarningMessage(`Review complete: Found ${result.findings.length} issues.`);
                }
            } catch (error: any) {
                vscode.window.showErrorMessage(`Review failed: ${error.message}`);
            }
        });
    });

    context.subscriptions.push(disposable);
}

function updateDiagnostics(document: vscode.TextDocument, result: ReviewResult): void {
    const diagnostics: vscode.Diagnostic[] = [];

    result.findings.forEach((finding: any) => {
        // Line numbers are 1-based from AI, VS Code is 0-based
        const line = Math.max(0, (finding.line || 1) - 1);
        const range = new vscode.Range(line, 0, line, 80); // Default to full line or until column 80

        const severity = mapSeverity(finding.severity);
        const message = `${finding.title}\n\nExplanation: ${finding.explanation}\n\nSuggestion: ${finding.suggestion}`;
        
        const diagnostic = new vscode.Diagnostic(range, message, severity);
        diagnostic.source = 'Local AI Reviewer';
        diagnostic.code = finding.category;
        
        diagnostics.push(diagnostic);
    });

    diagnosticCollection.set(document.uri, diagnostics);
}

function mapSeverity(severity: string): vscode.DiagnosticSeverity {
    switch (severity.toLowerCase()) {
        case 'critical':
        case 'high':
            return vscode.DiagnosticSeverity.Error;
        case 'medium':
            return vscode.DiagnosticSeverity.Warning;
        case 'low':
            return vscode.DiagnosticSeverity.Information;
        default:
            return vscode.DiagnosticSeverity.Hint;
    }
}

export function deactivate() {
    if (diagnosticCollection) {
        diagnosticCollection.clear();
        diagnosticCollection.dispose();
    }
}
