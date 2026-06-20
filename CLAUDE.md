# CLAUDE.md — Project Instructions

> Keep this file under ~200 lines. Every line costs context on every turn — if a rule belongs in a linter config or a README, put it there instead of here.

## Quick Reference (read first)

- **Install:** `TODO — e.g. npm install`
- **Dev server:** `TODO`
- **Build:** `TODO`
- **Lint:** `TODO`
- **Tests:** `TODO` (no test files currently exist — see "What NOT to Do")

## Project Context

- **Stack:** React, functional components only, Zustand for global state, i18n via `useTranslation()` (`en` / `fa`)
- **API layer:** `src/services/` for all API calls — `src/api/` is legacy re-exports only, never add to it
- **Datetime inputs:** always `<DateTimeField>`, never native `<input type="datetime-local">`

## Before Making Any Changes

1. Read `MEMORY.md` first — the project's long-term memory (conventions, architectural decisions, reusable patterns, known issues, mandatory rules).
2. Inspect the relevant source files before implementing. Match existing patterns before writing new code.
3. Check whether a util, component, or hook already exists before creating one.

## Core Rules

- Prefer existing patterns over new ones; match the style and structure of surrounding code.
- Avoid unnecessary dependencies — use what's already installed.
- Use `src/services/` for API calls, never `src/api/`.
- Use `<DateTimeField>` for all datetime inputs.
- i18n everything visible: no hardcoded English strings in JSX. Add keys to both `en.json` and `fa.json`.
- Follow the Mandatory Rules in `MEMORY.md`: API error handling, loading skeletons, Persian localization, locale-aware datetime.
- If a requirement is ambiguous, or `MEMORY.md` is silent on a pattern, ask rather than guess.

## Code Style

- Functional components only — no class components.
- Local state: `useState`. Global state: Zustand stores.
- API error handling: 422 → field errors, all other errors → `Alert` (full pattern in `MEMORY.md`).
- Loading states: animated skeleton divs only — never spinner text or empty content.
- All visible text via `useTranslation()` / `t("key")`.
- Don't write style rules here that a linter/formatter already enforces (quote style, semicolons, import order, etc.) — those belong in `.eslintrc` / `.prettierrc`, not this file.

## Updating MEMORY.md

Update `MEMORY.md` only when:
- a new reusable pattern is introduced
- an architectural decision is made
- a bug pattern is discovered and generalized

Do NOT update it for small one-off fixes.

## What NOT to Do

- Don't refactor or clean up code unrelated to the current task.
- Don't add error handling for scenarios that cannot happen.
- Don't add comments explaining *what* code does — only non-obvious *why*.
- Don't create new utilities/abstractions unless the same logic appears 3+ times.
- Don't update tests unless behavior changes (no test files currently exist).
- Don't create documentation files unless explicitly asked.

## Git Workflow (Strict)

A task is not complete until it's committed. Treat each feature as one checkpoint:

**Implement → Validate → Commit → Stop.**

Never combine two features in one working cycle, and never start a new task before committing the current one.

1. **Inspect:** `git status` / `git diff`
2. **Classify** (pick exactly one): `feat` · `fix` · `refactor` · `chore` · `test` · `docs`
3. **Stage only relevant changes** — don't blindly stage everything.
4. **Commit:** `<type>: <short description>`
5. **Stop.** Do not resume implementation until the commit is done.

Forbidden: batching multiple features into one commit, mixing unrelated changes into one commit, continuing to code after a feature is done without committing.

> CLAUDE.md is advisory, not enforced — Claude follows it reliably but not with 100% consistency. For rules that must hold without exception (never commit secrets, always run lint before commit, etc.), back them with a pre-commit hook or CI check rather than relying on this file alone.

## End of Task

Provide a concise summary:
- What was changed and why.
- Any remaining TODOs or known gaps introduced or discovered.