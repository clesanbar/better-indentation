"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const indentation_1 = require("../src/indentation");
function test() {
    // Test 1
    const lines1 = [
        'mutate(test = "dog",',
        ''
    ];
    const doc1 = {
        lineAt: (l) => ({ text: lines1[l], range: { end: { character: lines1[l].length } } })
    };
    const col1 = (0, indentation_1.getAlignmentColumn)(doc1, { line: 1, character: 0 });
    console.log(`Test 1: ${col1 === 7 ? 'PASS' : 'FAIL (got ' + col1 + ')'}`);
    // Test 2
    const lines2 = [
        'iris |>',
        '  mutate(test = "dog",',
        '         test_2 = "cat")'
    ];
    const doc2 = {
        lineAt: (l) => ({ text: lines2[l], range: { end: { character: lines2[l].length } } })
    };
    const col2 = (0, indentation_1.getAlignmentColumn)(doc2, { line: 2, character: 0 });
    console.log(`Test 2: ${col2 === 9 ? 'PASS' : 'FAIL (got ' + col2 + ')'}`);
    // Test 3 (iris example)
    const lines3 = [
        'iris |>',
        '  mutate(test= "dog",',
        ''
    ];
    const doc3 = {
        lineAt: (l) => ({ text: lines3[l], range: { end: { character: lines3[l].length } } })
    };
    const col3 = (0, indentation_1.getAlignmentColumn)(doc3, { line: 2, character: 0 });
    console.log(`Test 3 (iris): ${col3 === 9 ? 'PASS' : 'FAIL (got ' + col3 + ')'}`);
    // Test 4 (empty after bracket)
    const lines4 = [
        'mutate(',
        ''
    ];
    const doc4 = {
        lineAt: (l) => ({ text: lines4[l], range: { end: { character: lines4[l].length } } })
    };
    const col4 = (0, indentation_1.getAlignmentColumn)(doc4, { line: 1, character: 0 });
    console.log(`Test 4 (empty): ${col4 === undefined ? 'PASS' : 'FAIL (got ' + col4 + ')'}`);
}
test();
//# sourceMappingURL=test-logic.js.map