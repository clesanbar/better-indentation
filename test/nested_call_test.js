
const indentation = require('../out/indentation');

function test() {
    console.log('Running Nested Call Test...');
    const tabSize = 2;

    const cases = [
        {
            name: 'Nested case_when assignment',
            line: '  mutate(j = case_when(',
            expected: 11
        },
        {
            name: 'Simple function call',
            line: '  mutate(',
            expected: 4
        },
        {
            name: 'Second argument assignment',
            line: '  mutate(a, b = case_when(',
            // "  mutate(a, b = case_when("
            // 01234567890123456789012345
            // "  mutate(" -> 9
            // "a" -> 9
            // "," -> 10
            // " " -> 11
            // "b" -> 12.
            // Expected 12 + 2 = 14.
            expected: 14
        },
        {
            name: 'Top level assignment',
            line: '         i = case_when(',
            // "         i" -> i at 9.
            // Expected 9 + 2 = 11.
            expected: 11
        },
        {
            name: 'Complex nesting',
            line: '  mutate(fun(a), b = case_when(',
            // "  mutate(fun(a), b = case_when("
            // "  mutate(" -> 9.
            // "fun(a)"
            // "," at ...
            // Let's count.
            // "  mutate(" -> 9 chars.
            // "fun(a)" -> 6 chars.
            // "," -> 1 char.
            // " " -> 1 char.
            // "b" -> start at 9 + 6 + 1 + 1 = 17?
            // Wait.
            // "  mutate(" (index 0-8).
            // "fun(a)" (index 9-14).
            // "," (index 15).
            // " " (index 16).
            // "b" (index 17).
            // Expected 17 + 2 = 19.
            expected: 19
        },
        {
            name: 'Arithmetic expression',
            line: '  x = (a + b) + c(',
            // "  x = (a + b) + c("
            // "  x" -> x at 2.
            // " = "
            // "(a + b)"
            // " + "
            // "c" -> start of term?
            // Stack: [0]
            // "(" -> [0, 7] (after first paren).
            // ")" -> [0].
            // "+"
            // "c("
            // Result 0 ("x").
            // "x" at 2.
            // Expected 2 + 2 = 4.
            expected: 4
        }
    ];

    let passed = true;
    for (const c of cases) {
        const doc = {
            lineAt: (l) => ({ text: c.line, range: { end: { character: c.line.length } } })
        };
        // Line 1 because we pass line index + 1 usually? 
        // No, `getIndentationEdit` takes position.line.
        // And it looks at `position.line - 1`.
        // So if we want to test indentation FOR the next line, we pass position at next line.
        // The line provided is line 0.
        // We simulate being at line 1, char 0.
        
        const col = indentation.getIndentationEdit(doc, { line: 1, character: 0 }, tabSize);
        
        if (col !== c.expected) {
            console.log(`FAIL: ${c.name}. Expected ${c.expected}, got ${col}`);
            passed = false;
        } else {
            console.log(`PASS: ${c.name}`);
        }
    }
    
    if (!passed) {
        process.exit(1);
    }
}

test();
