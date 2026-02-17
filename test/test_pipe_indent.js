const { getIndentationEdit } = require('../out/indentation');

function runTest(name, lines, expectedIndent) {
    const doc = {
        lineAt: (l) => {
            if (l < 0 || l >= lines.length) return { text: "", range: { end: { character: 0 } } };
            return {
                text: lines[l],
                range: { end: { character: lines[l].length } }
            };
        }
    };
    
    // Position is at the end of the last line
    const position = {
        line: lines.length, // simulating cursor on new line
        character: 0 
    };
    
    // We are simulating pressing Enter at the end of the last line in `lines`.
    // getIndentationEdit takes the position of the cursor *on the new line*.
    // So position.line is the index of the new empty line.
    
    const indent = getIndentationEdit(doc, position, 2);
    
    if (indent === expectedIndent) {
        console.log(`PASS: ${name}`);
    } else {
        console.log(`FAIL: ${name}. Expected ${expectedIndent}, got ${indent}`);
    }
}

// Test 1: Pipe inside function call
// third_data <- data |>
//   left_join(second_data |>
//             mutate(
runTest(
    "Pipe inside function call",
    [
        "third_data <- data |>",
        "  left_join(second_data |>"
    ],
    14 // '  left_join(' is 12 chars. 'second_data' starts at 12. +2 indent = 14.
);

// Test 2: Standard pipe
runTest(
    "Standard pipe",
    [
        "data |>"
    ],
    2
);

// Test 3: Standard pipe nested
runTest(
    "Standard pipe nested",
    [
        "data |>",
        "  mutate(x=1) |>"
    ],
    2
);

// Test 4: Pipe inside argument on new line
// call(
//   arg |>
runTest(
    "Pipe inside argument on new line",
    [
        "call(",
        "  arg |>"
    ],
    4 // '  arg' is at 2. +2 indent = 4.
);

// Test 5: Pipe inside complex function call
// library(tidyverse)
// data <- tibble(a, b) |>
//   mutate(
//     c = a + b,
//     d = c * 10
//   )
//
// second_data <- tibble(a) |>
//   mutate(f = a^2,
//          g = f*3) |>
//   filter(a == 4)
//
// third_data <- data |>
//   left_join(second_data |>
runTest(
    "Complex context pipe inside function",
    [
        "third_data <- data |>",
        "  left_join(second_data |>"
    ],
    14
);
