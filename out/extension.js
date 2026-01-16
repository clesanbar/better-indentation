"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    const provider = vscode.languages.registerOnTypeFormattingEditProvider({ language: 'r' }, {
        provideOnTypeFormattingEdits(document, position, ch, options, _token) {
            if (ch !== '\n') {
                return undefined;
            }
            return getAlignmentEdit(document, position, options);
        }
    }, '\n');
    context.subscriptions.push(provider);
}
exports.activate = activate;
function getAlignmentEdit(document, position, _options) {
    // We are on the new line (position.line).
    // We want to look at the code before the cursor to find the most recent open bracket.
    const lineIndex = position.line - 1;
    if (lineIndex < 0) {
        return undefined;
    }
    let bracketLevel = 0;
    let foundBracketPos;
    let foundBracketChar;
    // Scan backwards from the end of the previous line
    for (let l = lineIndex; l >= 0; l--) {
        const lineText = document.lineAt(l).text;
        const startChar = (l === lineIndex) ? document.lineAt(l).range.end.character : lineText.length;
        for (let c = startChar - 1; c >= 0; c--) {
            const char = lineText[c];
            // Simple string/comment skip (very basic)
            if (isInStringOrComment(lineText, c)) {
                continue;
            }
            if (char === ')' || char === ']' || char === '}') {
                bracketLevel++;
            }
            else if (char === '(' || char === '[' || char === '{') {
                if (bracketLevel === 0) {
                    foundBracketPos = new vscode.Position(l, c);
                    foundBracketChar = char;
                    break;
                }
                bracketLevel--;
            }
        }
        if (foundBracketPos) {
            break;
        }
    }
    if (!foundBracketPos || foundBracketChar === '{') {
        // For curly braces, standard indentation is usually fine.
        return undefined;
    }
    // Now we found the opening bracket at foundBracketPos.
    // Check if there is text after it on the same line.
    const bracketLineText = document.lineAt(foundBracketPos.line).text;
    const textAfterBracket = bracketLineText.substring(foundBracketPos.character + 1);
    const firstNonWsMatch = textAfterBracket.match(/\S/);
    let targetColumn;
    if (firstNonWsMatch && firstNonWsMatch.index !== undefined) {
        // Align with the first non-whitespace character after the bracket
        targetColumn = foundBracketPos.character + 1 + firstNonWsMatch.index;
    }
    else {
        // No text after bracket on that line, just indent one level relative to the bracket's line
        // Actually, if we want RStudio style:
        // fun(
        //   arg
        // )
        // It's just a standard indent.
        return undefined;
    }
    const targetIndentation = ' '.repeat(targetColumn);
    const currentLineText = document.lineAt(position.line).text;
    const currentIndentMatch = currentLineText.match(/^\s*/);
    const currentIndentLength = currentIndentMatch ? currentIndentMatch[0].length : 0;
    // Replace the current indentation with the target indentation
    const editRange = new vscode.Range(position.line, 0, position.line, currentIndentLength);
    return [vscode.TextEdit.replace(editRange, targetIndentation)];
}
function isInStringOrComment(lineText, index) {
    // Check for comment
    const commentIndex = lineText.indexOf('#');
    if (commentIndex !== -1 && index >= commentIndex) {
        return true;
    }
    // Check for string (very simplified)
    let inDoubleQuote = false;
    let inSingleQuote = false;
    for (let i = 0; i < index; i++) {
        const char = lineText[i];
        if (char === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
        }
        else if (char === "'" && !inDoubleQuote) {
            inSingleQuote = !inSingleQuote;
        }
    }
    return inDoubleQuote || inSingleQuote;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map