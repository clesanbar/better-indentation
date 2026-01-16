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

    const prevLine = document.lineAt(lineIndex);
    const prevLineText = prevLine.text;

    // Check for Pipe Indentation
    // Regex for pipe at end of line: |> or %>% or + or %T> or %<>%
    // We check for > (end of |>, %T>, %<>%), % (end of %>%), or +
    if (/(?:%>|\|>|\+)\s*$/.test(prevLineText) || /%\s*$/.test(prevLineText)) {
       return getPipeIndentation(document, lineIndex, tabSize);
    }

    // Check for Argument Alignment
    return getAlignmentColumn(document, position);
}

function getPipeIndentation(document: FakeDocument, lineIndex: number, tabSize: number): number {
    const prevLineText = document.lineAt(lineIndex).text;
    
    // 1. Find the anchor line.
    
    const pipeMatch = prevLineText.match(/((?:%>%)|(?:\|>)|(?:%T>)|(?:%<>%)|(?:\+))\s*$/);
    if (!pipeMatch) {
         // Fallback if the initial check passed but this strict one didn't.
         // e.g. maybe it ended in % but wasn't a pipe?
         // But let's try to match simpler.
         return 0; 
    }
    
    const textBeforePipe = prevLineText.substring(0, pipeMatch.index);
    
    // We need to find the "logical start" of this line's expression.
    // Scan backwards finding matching brackets.
    let bracketLevel = 0;
    let anchorLineIndex = lineIndex;
    
    // We only need to scan if there is a closing bracket at the end of textBeforePipe?
    // Not necessarily. "filter() |>" -> ")" is there.
    // "select(a) |>" -> ")" is there.
    
    // Actually, we want to find the open bracket that *matches* the last closing bracket?
    // No, we want to find the open bracket that contains the expression? 
    // In "b) |>", the expression ending at ")" started at "(".
    
    // Let's reuse the scan logic but go across lines if needed.
    // We start scanning from end of textBeforePipe.
    
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
                        // We closed a group.
                        // Is this the "main" group?
                        // In "b) |>", we hit ")", level 1. Then "(", level 0.
                        // We are now at "tibble(". 
                        // We continue? No, if we just want the anchor for indentation, this might be it.
                        anchorLineIndex = currentScanLineIndex;
                    }
                } else {
                    // Open bracket with no matching close bracket (in our backward scan).
                    // This means we are inside this bracket.
                    // e.g. "mutate( |>" -> We found "(".
                    // This is definitely the start.
                    anchorLineIndex = currentScanLineIndex;
                    // But wait, do we stop?
                    // If we have "data |> filter() |>", 
                    // Scan back: ")" -> level 1. "(" -> level 0.
                    // Anchor becomes "filter" line.
                    // Loop continues.
                    // If we stop at level 0, we found the pair for the last thing.
                    // If we just want the line that *contains* the matching start of the *last* closed group?
                }
            }
        }
        
        // If we are balancing brackets, and we are at level 0, we generally stop?
        // In "b) |>", we match ")". Level 0 at "(".
        // If we stop there, anchor is "tibble" line. Correct.
        
        // In "filter() |>", we match ")". Level 0 at "(".
        // If we stop there, anchor is "filter" line. Correct.
        
        if (bracketLevel === 0 && currentScanLineIndex !== lineIndex) {
             // We went back lines and balanced.
             break;
        }
        if (bracketLevel === 0 && currentScanLineIndex === lineIndex) {
            // We balanced on the same line.
            // But we need to be careful. "tibble(a, b) |>" -> Balanced on same line. Anchor is same line.
            // "b) |>" -> Balanced on prev line. Anchor is prev line.
            // So if bracketLevel is 0, we can basically stop scanning?
            // Unless we haven't encountered any brackets yet?
            // "x |>" -> bracketLevel always 0.
            break;
        }

        currentScanLineIndex--;
        if (currentScanLineIndex >= 0) {
            currentScanText = document.lineAt(currentScanLineIndex).text;
             // Need to handle multi-line scan correctly (checking range end etc)
             // simplified here assuming text is enough
        }
    }
    
    // Now we have anchorLineIndex.
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
