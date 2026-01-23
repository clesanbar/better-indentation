# Gemini Coding Conventions for This Project

This document outlines the R coding conventions to be used by the Gemini assistant for this project. The style is derived from the analysis of my scripts.

## 1. File Structure & Comments

-   **Section Headers:** Organize scripts into logical blocks using commented headers. The header should be followed by a line of dashes.
    ```r
    # Section name ----------
    ```
-   **Explanatory Comments:** Add comments to explain the purpose of a specific step or a non-obvious line of code. In general, it is better to include more comments than less. Include the comments in between each line.

## 2. Code Style & Syntax

-   **`tidyverse` Style:** All data manipulation should follow `tidyverse` conventions, primarily using functions from packages like `dplyr` and `purrr`.
-   **Piping:** Use the native R pipe (`|>`) for all function chaining. Do not use the `magrittr` pipe (`%>%`), unless it is absolutely necessary.
-   **Naming Conventions:** All variable and function names must use `snake_case` (e.g., `my_variable_name`, `calculate_results()`).
-   **File Paths:** Always use `file.path()` to construct file paths to ensure they work across different operating systems.

## 3. Script Setup

-   **Library Loading:** All `library()` calls must be at the very top of the script in a dedicated "Setup" section.
-   **Global Settings:** Project-wide settings, such as `options()` or `theme_set()`, should be defined in the "Setup" section.
-   **Preferred Libraries:** When writing new scripts, prefer using the existing stack of libraries:
    -   `sf`
    -   `terra`
    -   `exactextractr`
    -   `arrow`
    -   `data.table`
    -   `tidyverse`

## 4. Data Input/Output

-   **Reading Data:** Use appropriate functions for reading data, such as `sf::st_read()` for spatial data and `arrow::open_dataset()` for Parquet files.
-   **Writing Data:** Prefer writing output files in space-efficient formats like Parquet (`.parquet`) using `arrow::write_parquet()`.

## 5. Workflow

-   **Git:** The user prefers to commit changes themselves. Never commit any changes you have made to Git.

-   **README Updates:** After completing a requested task, review the `README.md` file and remove any mention of the task being a "to-do" item. Treat the `README.md` as a dynamic list of pending actions.