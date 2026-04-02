# GitHub Copilot Code Review Instructions

## Focus Areas (High Priority)
* ONLY flag critical bugs, security vulnerabilities (like Supabase RLS bypasses), and severe performance bottlenecks.
* Focus on architectural integrity and incorrect business logic.
* Flag missing error handling on Server Actions.

## What to IGNORE (Do NOT comment on these)
* DO NOT comment on code formatting, whitespace, trailing commas, or indentation.
* DO NOT comment on variable naming conventions unless they are actively misleading.
* DO NOT suggest minor stylistic refactors or syntax golf (e.g., changing a standard `if` statement to a ternary) if the existing code works correctly.
* DO NOT comment on missing code comments or documentation.