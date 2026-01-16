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
        } else if (char === "'" && !inDoubleQuote) {
            inSingleQuote = !inSingleQuote;
        }
    }
    return inDoubleQuote || inSingleQuote;
}
