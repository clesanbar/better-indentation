# indentR: an extension for better indentation in Positron

<img src="logo/final_logo.png" width="200" alt="indentR Logo">

The main goal of this project is to build an extension for Positron that mimics the way that indentation works for RStudio. Consider the following example, adapted from [this post](https://stackoverflow.com/questions/79736776/how-to-have-function-argument-indenting):

```
iris |>
  # only function indented
  mutate(test= "dog",
# function arguments not indented
test_2 = "cat")

iris |> 
  # function is indented
  mutate(test= "dog",
         # and function arguments are indented
         test_2 = "cat")
```
The first is what you get when you're writing in Positron, while the second is what you get when you are writing in RStudio. Even if some consider the second to be improper code, I think it looks nice. And while I understand that some prefer things like Air to format their code, I personally think it looks ugly, and that it is a waste of vertical space (sorry). I learned to code in R using RStudio, and want to keep using the same indentation rules now that I'm relying more on Positron. It seems the Posit team is not interested in implementing this feature, so I want to take it upon myself to do it with the help of Gemini CLI.

This extension has been tested for version 2026.01.0 build 147 of Positron.

## Repository structure

- `src/`: Core TypeScript implementation logic.
- `test/`: Test cases and scripts to verify indentation behavior.
- `config/`: Configuration files (TypeScript config, Language configuration).
- `docs/`: Project research and design documentation.
- `releases/`: Packaged `.vsix` files for installation.

## Installation instructions

1. Download the latest version in the `releases/` folder.
2. Use `cmd+shift+P` (MacOS) or `ctrl+shift+P` (Windows) to open the command palette, and select "Extensions: install from VSIX".
3. Select the `.vsix` that was downloaded.
4. To uninstall, go to the command palette, and select "Extensions: show installed extensions" and then click on the settings next to indentR and click on "uninstall".

**If you find any situation in which the current implementation struggles, please let me know!**


# Development

## Initial steps

- [x] **Research:** Investigate Positron/VS Code extension capabilities for custom indentation (specifically `language-configuration.json` and `OnEnterRules`).
- [x] **Setup:** Initialize the project as a VS Code extension (using TypeScript/JavaScript).
- [x] **Implementation - Pipe:** Implement indentation logic for the native pipe operator `|>`.
- [x] **Implementation - Arguments:** Implement alignment logic for function arguments inside parentheses.
- [x] **Testing:** Verify the behavior against the `iris` example provided in the overview.

## Planned changes in functionality

- [x] Pipe indentation erroneously inherits deep indentation from aligned arguments.
- [x] The indentation seems to reset when including a comment between a pipe and a function.
- [x] Avoid increasing indentation in the middle of a piped object.
- [x] Completely reset indentation after the chain of pipes is over and a new object is created.
- [x] Allow for some degree of air-like formatting when the user hits enter inside an empty parenthesis after a function call.
- [x] Improve consistency of indenting when using function calls inside of function calls.
- [ ] Fix bug with incorrect position of parentheses inside of nested indentation.
- [ ] Fix the issue with using pipes inside of function calls.
- [ ] Automatically close parentheses and quotation marks, as the default Positron functionality does.

## Things that I still need to test

- Examine indentation when creating a function
- Examine indentation when creating a for loop
- Examine indentation inside a tryCatch call
