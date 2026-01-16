"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const indentation_1 = require("./indentation");
function activate(context) {
    const provider = vscode.languages.registerOnTypeFormattingEditProvider({ language: 'r' }, {
        provideOnTypeFormattingEdits(document, position, ch, _options, _token) {
            if (ch !== '\n') {
                return undefined;
            }
            // Wrap document for the pure logic function
            const fakeDoc = {
                lineAt: (l) => {
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
            const targetColumn = (0, indentation_1.getAlignmentColumn)(fakeDoc, {
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
            const editRange = new vscode.Range(position.line, 0, position.line, currentIndentLength);
            return [vscode.TextEdit.replace(editRange, targetIndentation)];
        }
    }, '\n');
    context.subscriptions.push(provider);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map