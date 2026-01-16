"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const indentation_1 = require("../src/indentation");
function test() {
    // Case from user
    const lines1 = [
        'data <- tibble(a,',
        '               b) |>',
        ''
    ];
    // line 1 indent: 15. Ends in pipe.
    // Anchor should be line 0 (tibble). Indent 0.
    // Result should be 2.
    const doc1 = {
        lineAt: (l) => ({ text: lines1[l], range: { end: { character: lines1[l].length } } })
    };
    const col1 = (0, indentation_1.getIndentationEdit)(doc1, { line: 2, character: 0 }, 2);
    console.log(`Test User Case: ${col1 === 2 ? 'PASS' : 'FAIL (got ' + col1 + ')'}`);
    // Case Standard Pipe
    const lines2 = [
        'data |>',
        '  filter(x == 1) |>',
        ''
    ];
    // line 1 indent: 2. Ends in pipe.
    // Anchor should be line 1 (filter). Indent 2.
    // Previous line (0) ends in pipe.
    // Result should be 2.
    const doc2 = {
        lineAt: (l) => ({ text: lines2[l], range: { end: { character: lines2[l].length } } })
    };
    const col2 = (0, indentation_1.getIndentationEdit)(doc2, { line: 2, character: 0 }, 2);
    console.log(`Test Standard Pipe: ${col2 === 2 ? 'PASS' : 'FAIL (got ' + col2 + ')'}`);
    // Case Initial Pipe
    const lines3 = [
        'data |>',
        ''
    ];
    // line 0 indent: 0. Ends in pipe.
    // Anchor line 0. Indent 0.
    // Previous line: None.
    // Result should be 0 + 2 = 2.
    const doc3 = {
        lineAt: (l) => ({ text: lines3[l], range: { end: { character: lines3[l].length } } })
    };
    const col3 = (0, indentation_1.getIndentationEdit)(doc3, { line: 1, character: 0 }, 2);
    console.log(`Test Initial Pipe: ${col3 === 2 ? 'PASS' : 'FAIL (got ' + col3 + ')'}`);
    // Case Arguments (Old logic)
    const lines4 = [
        'mutate(test = "dog",',
        ''
    ];
    const doc4 = {
        lineAt: (l) => ({ text: lines4[l], range: { end: { character: lines4[l].length } } })
    };
    const col4 = (0, indentation_1.getIndentationEdit)(doc4, { line: 1, character: 0 }, 2);
    console.log(`Test Args: ${col4 === 7 ? 'PASS' : 'FAIL (got ' + col4 + ')'}`);
}
test();
//# sourceMappingURL=test-pipe.js.map