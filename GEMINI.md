# Gemini instructions for this project

This document outlines instructions that are followed by the Gemini assistant for this project:

- **README:** The Gemini assistant should consult the README.md file in the root directory of the project before carrying out any task.

- **Git:** The user prefers to commit changes themselves. The Gemini assistant should never commit any changes they have made to Git.

- **Task completion:** After completing a requested task, review the `README.md` file and tick any action items related to the task that was completed.

- **Compilation:** Each time that a new version of the extension has been created, compile the new VSIX file. If the new version is just a bug fix, change the version number by the second decimal (i.e., from 0.0.1 to 0.0.2). If the new version includes new functionality, change the version number by the first decimal (i.e., from 0.0.2 to 0.1.0). Only when the user explicitly says that this is a new release should you change the version by the integer (i.e., from 0.1.0 to 1.0.0).
