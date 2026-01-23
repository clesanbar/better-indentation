export interface FakeLine {
    text: string;
    range: {
        end: {
            character: number;
        }
    };
}

export interface FakeDocument {
    lineAt(line: number): FakeLine;
}

export interface FakePosition {
    line: number;
    character: number;
}

export function getIndentationEdit(
    document: FakeDocument,
    position: FakePosition,
    tabSize: number = 2
): number | undefined {
    const lineIndex = position.line - 1;
    if (lineIndex < 0) {
        return undefined;
    }

    // Look for the "effective" previous line (skipping comments/empty lines)
    // for Pipe Indentation purposes.
    let effectiveLineIndex = lineIndex;
    let effectiveLineText = document.lineAt(effectiveLineIndex).text;
    
    // Scan backwards for non-comment/non-empty line
    for (let i = lineIndex; i >= 0; i--) {
        const text = document.lineAt(i).text;
        // Check if line is empty or a full-line comment
        if (!/^\s*#/.test(text) && !/^\s*$/.test(text)) {
            effectiveLineIndex = i;
            effectiveLineText = text;
            break;
        }
    }

    // Check for Pipe Indentation
    // Regex for pipe at end of line: |> or %>% or + or %T> or %<>%
    // We check for > (end of |>, %T>, %<>%), % (end of %>%), or +
    if (/(?:%>|\|>|\+)\s*$/.test(effectiveLineText) || /%\s*$/.test(effectiveLineText)) {
       return getPipeIndentation(document, effectiveLineIndex, tabSize);
    }

    // Check for Argument Alignment
    const alignment = getAlignmentColumn(document, position);
    if (alignment !== undefined) {
        return alignment;
    }

    // Check for Reset after Pipe Chain
    // If the previous line did not end in a pipe (otherwise we'd be in the first if),
    // we check if it was the end of a chain.
    // We find the start of the expression on the previous line.
    const startLineIndex = findExpressionStart(document, effectiveLineIndex);
    
    // Check if the line BEFORE the expression start ends in a pipe.
    let preStartLineIndex = startLineIndex - 1;
    let preStartLineText = "";
     // Scan backwards
    for (let i = preStartLineIndex; i >= 0; i--) {
        const text = document.lineAt(i).text;
        if (!/^\s*#/.test(text) && !/^\s*$/.test(text)) {
            preStartLineIndex = i;
            preStartLineText = text;
            break;
        }
    }

    if (preStartLineIndex >= 0 && preStartLineIndex < startLineIndex) {
        if (/(?:%>|\|>|\+)\s*$/.test(preStartLineText) || /%\s*$/.test(preStartLineText)) {
            // The expression starting at startLineIndex follows a pipe.
            // So it was part of a chain.
            // Since effectiveLine (end of that expression) does NOT end in a pipe,
            // we have finished the chain.
            // We want to reset to the anchor of the chain.
            
            const anchorLineIndex = findPipeAnchor(document, preStartLineIndex);
            const anchorLine = document.lineAt(anchorLineIndex);
            const anchorIndentMatch = anchorLine.text.match(/^\s*/);
            return anchorIndentMatch ? anchorIndentMatch[0].length : 0;
        }
    }

    return undefined;
}

function findExpressionStart(document: FakeDocument, lineIndex: number): number {
    let bracketLevel = 0;
    let currentScanLineIndex = lineIndex;
    let currentScanText = document.lineAt(currentScanLineIndex).text;
    
    while (currentScanLineIndex >= 0) {
        for (let c = currentScanText.length - 1; c >= 0; c--) {
            if (isInStringOrComment(currentScanText, c)) continue;
            
            const char = currentScanText[c];
            if (char === ')' || char === ']' || char === '}') {
                bracketLevel++;
            } else if (char === '(' || char === '[' || char === '{') {
                 if (bracketLevel > 0) {
                    bracketLevel--;
                } 
            }
        }
        
        if (bracketLevel === 0) {
             return currentScanLineIndex;
        }

        currentScanLineIndex--;
        if (currentScanLineIndex >= 0) {
            currentScanText = document.lineAt(currentScanLineIndex).text;
        }
    }
    return 0;
}

function getPipeIndentation(document: FakeDocument, lineIndex: number, tabSize: number): number {
    const anchorLineIndex = findPipeAnchor(document, lineIndex);
    const anchorLine = document.lineAt(anchorLineIndex);
    const anchorIndentMatch = anchorLine.text.match(/^\s*/);
    const anchorIndent = anchorIndentMatch ? anchorIndentMatch[0].length : 0;
    
    // 2. Check predecessor of anchor line.
    const prevAnchorIndex = anchorLineIndex - 1;
    let addIndent = true;
    
    if (prevAnchorIndex >= 0) {
        const prevAnchorText = document.lineAt(prevAnchorIndex).text;
         // Fix regex to match |> (ends in >), %>% (ends in %), + (ends in +)
         if (/(?:%>|\|>|\+)\s*$/.test(prevAnchorText) || /%\s*$/.test(prevAnchorText)) {
             addIndent = false;
         }
    }
    
    return addIndent ? anchorIndent + tabSize : anchorIndent;
}

function findPipeAnchor(document: FakeDocument, lineIndex: number): number {
    const prevLineText = document.lineAt(lineIndex).text;
    
    const pipeMatch = prevLineText.match(/((?:%>%)|(?:\|>)|(?:%T>)|(?:%<>%)|(?:\+))\s*$/);
    if (!pipeMatch) {
         return lineIndex; 
    }
    
    const textBeforePipe = prevLineText.substring(0, pipeMatch.index);
    
    let bracketLevel = 0;
    let anchorLineIndex = lineIndex;
    
    let currentScanLineIndex = lineIndex;
    let currentScanText = textBeforePipe;
    
    while (currentScanLineIndex >= 0) {
        for (let c = currentScanText.length - 1; c >= 0; c--) {
            const char = currentScanText[c];
            if (isInStringOrComment(currentScanText, c)) continue;
            
            if (char === ')' || char === ']' || char === '}') {
                bracketLevel++;
            } else if (char === '(' || char === '[' || char === '{') {
                if (bracketLevel > 0) {
                    bracketLevel--;
                    if (bracketLevel === 0) {
                        anchorLineIndex = currentScanLineIndex;
                    }
                } else {
                    anchorLineIndex = currentScanLineIndex;
                }
            }
        }
        
        if (bracketLevel === 0 && currentScanLineIndex !== lineIndex) {
             break;
        }
        if (bracketLevel === 0 && currentScanLineIndex === lineIndex) {
            break;
        }

        currentScanLineIndex--;
        if (currentScanLineIndex >= 0) {
            currentScanText = document.lineAt(currentScanLineIndex).text;
        }
    }
    return anchorLineIndex;
}

export function getAlignmentColumn(
    document: FakeDocument,
    position: FakePosition
): number | undefined {
    const lineIndex = position.line - 1;
    if (lineIndex < 0) {
        return undefined;
    }

    let bracketLevel = 0;
    let foundBracketPos: { line: number, character: number } | undefined;
    let foundBracketChar: string | undefined;

    for (let l = lineIndex; l >= 0; l--) {
        const line = document.lineAt(l);
        const lineText = line.text;
        const startChar = (l === lineIndex) ? line.range.end.character : lineText.length;

        for (let c = startChar - 1; c >= 0; c--) {
            const char = lineText[c];

            if (isInStringOrComment(lineText, c)) {
                continue;
            }

            if (char === ')' || char === ']' || char === '}') {
                bracketLevel++;
            } else if (char === '(' || char === '[' || char === '{') {
                if (bracketLevel === 0) {
                    foundBracketPos = { line: l, character: c };
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
        return undefined;
    }

    const bracketLineText = document.lineAt(foundBracketPos.line).text;
    const textAfterBracket = bracketLineText.substring(foundBracketPos.character + 1);
    const firstNonWsMatch = textAfterBracket.match(/\S/);

    if (firstNonWsMatch && firstNonWsMatch.index !== undefined) {
        return foundBracketPos.character + 1 + firstNonWsMatch.index;
    } else {
        return undefined; 
    }
}

function isInStringOrComment(lineText: string, index: number): boolean {
    const commentIndex = lineText.indexOf('#');
    if (commentIndex !== -1 && index >= commentIndex) {
        return true;
    }

    let inDoubleQuote = false;
    let inSingleQuote = false;
    for (let i = 0; i < index; i++) {
        const char = lineText[i];
        if (char === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
        } else if (char === "'" && !inSingleQuote) {
            inSingleQuote = !inSingleQuote;
        }
    }
    return inDoubleQuote || inSingleQuote;
}
