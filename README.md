# IndenteR: an extension for better indentation in Positron

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

## Next Steps

- [ ] **Research:** Investigate Positron/VS Code extension capabilities for custom indentation (specifically `language-configuration.json` and `OnEnterRules`).
- [ ] **Setup:** Initialize the project as a VS Code extension (using TypeScript/JavaScript).
- [ ] **Implementation - Pipe:** Implement indentation logic for the native pipe operator `|>`.
- [ ] **Implementation - Arguments:** Implement alignment logic for function arguments inside parentheses.
- [ ] **Testing:** Verify the behavior against the `iris` example provided in the overview.

