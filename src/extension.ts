import * as vscode from 'vscode';
import { getAlignmentColumn } from './indentation';

export function activate(context: vscode.ExtensionContext) {
    const provider = vscode.languages.registerOnTypeFormattingEditProvider(
        { language: 'r' },
        {
            provideOnTypeFormattingEdits(document, position, ch, _options, _token) {
                if (ch !== '\n') {
                    return undefined;
                }

                // Wrap document for the pure logic function
                const fakeDoc = {
                    lineAt: (l: number) => {
                        const line = document.lineAt(l);
                        return {
                            text: line.text,
                            range: {
                                end: {
                                    character: line.range.end.character
                                }
                            }
                        };
                    }
                };

                const targetColumn = getAlignmentColumn(fakeDoc, {
                    line: position.line,
                    character: position.character
                });

                if (targetColumn === undefined) {
                    return undefined;
                }

                const targetIndentation = ' '.repeat(targetColumn);
                const currentLineText = document.lineAt(position.line).text;
                const currentIndentMatch = currentLineText.match(/^\s*/);
                const currentIndentLength = currentIndentMatch ? currentIndentMatch[0].length : 0;

                const editRange = new vscode.Range(
                    position.line, 0,
                    position.line, currentIndentLength
                );

                return [vscode.TextEdit.replace(editRange, targetIndentation)];
            }
        },
        '\n'
    );

    context.subscriptions.push(provider);
}

export function deactivate() {}
