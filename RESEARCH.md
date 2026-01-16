# Research: RStudio-like Indentation in Positron/VS Code

## Goal
Mimic RStudio's indentation behavior:
1.  **Pipes**: Indent the next line after `|>` or `%>%`.
2.  **Arguments**: Indent/align arguments inside function calls.

## Mechanism: `language-configuration.json`

VS Code allows language-specific configuration via a `language-configuration.json` file. Key properties:

### 1. `indentationRules`
Defines when to increase/decrease indent based on the current line's text.

*   **increaseIndentPattern**: Regex to indent the *next* line.
    *   *Candidate for Pipes*: `^.*(?:%>%|\|>|%T>|%<>%|\+)\s*$`
    *   *Candidate for Open Brackets*: `^.*[(\[{]$` (but this only does standard indent, not alignment).

### 2. `onEnterRules`
Defines actions when `Enter` is pressed. Can trigger `indent`, `outdent`, or `none`.

*   **Pipe Handling**:
    *   Match line ending in `|>` -> Action: `indent`.

### 3. Argument Alignment (The Challenge)
RStudio *aligns* arguments to the opening parenthesis:
```r
mutate(test = "dog",
       test_2 = "cat") -- "test_2" is aligned with "test"
```
Standard VS Code indentation (via `language-configuration.json`) usually results in:
```r
mutate(test = "dog",
  test_2 = "cat") -- Standard indent (2 or 4 spaces)
```
*   **Limitation**: `language-configuration.json` cannot easily calculate dynamic whitespace for alignment.
*   **Solution**: To achieve strict alignment, we may need to implement a `DocumentRangeFormattingEditProvider` or `OnTypeFormattingEditProvider` in the extension's `activate` function (TypeScript), which calculates the exact column of the opening parenthesis.

## Plan
1.  **Initial Attempt**: Configure `language-configuration.json` to handle Pipe indentation (easy) and standard block indentation for arguments.
2.  **Advanced**: If "standard indent" for arguments is insufficient (user wants strict alignment), we will need to implement a formatter in TypeScript.
