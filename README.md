# indentR: an extension for better indentation in Positron

## Overview

The main goal of this repository is to build an extension for Positron that mimics the way that indentation works for RStudio. Consider the following example:

```
iris |>
  #Only function indented
  mutate(test= "dog",
#function arguments not indented
test_2 = "cat")

iris |> 
  # function is indented
  mutate(test= "dog",
         # and function arguments are indented
         test_2 = "cat")
```
The first is what you get when you're writing in Positron, while the second is what you get when you are writing in R. I personally like the second one more, even if some might disagree. And while I understand that some prefer things like Air to format their code, I personally think it looks ugly, and that it is a waste of space. I learned to code in R using RStudio, and want to keep using the same indentation rules. It seems the Positron team is not interested in implementing this feature, so I want to take it upon myself to do it.

## Project Structure

- `src/`: Core TypeScript implementation logic.
- `test/`: Test cases and scripts to verify indentation behavior.
- `config/`: Configuration files (TypeScript config, Language configuration).
- `docs/`: Project research and design documentation.
- `releases/`: Packaged `.vsix` files for installation.

## Initial steps

- [x] **Research:** Investigate Positron/VS Code extension capabilities for custom indentation (specifically `language-configuration.json` and `OnEnterRules`).
- [x] **Setup:** Initialize the project as a VS Code extension (using TypeScript/JavaScript).
- [x] **Implementation - Pipe:** Implement indentation logic for the native pipe operator `|>`.
- [x] **Implementation - Arguments:** Implement alignment logic for function arguments inside parentheses.
- [x] **Testing:** Verify the behavior against the `iris` example provided in the overview.

## Subsequent steps

- [x] Pipe indentation erroneously inherits deep indentation from aligned arguments.
- [x] The indentation seems to reset when including a comment between a pipe and a function.
- [x] Avoid increasing indentation in the middle of a piped object.
- [x] Completely reset indentation after the chain of pipes is over and a new object is created.
- [] Automatically close parentheses and quotation marks, as the default Positron functionality does.

## Things that I need to test

- Use a case_when() inside a mutate call and see how that behaves
- Examine indentation when creating a function
- Examine indentation when creating a for loop
- Examine indentation inside a tryCatch call

## Future fixes, not priority

- [] Every time the extension compiles there is a "A 'repository' field is missing from the 'package.json' manifest file." warning that I have to manually accept. Add a the field that is necessary for this to stop being a problem.
