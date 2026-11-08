Part of #1

## What to build

Encode **Target net** and allowance amounts in the URL query string so a **Calculation** can be shared and reopened with fields pre-filled; no server persistence (ADR-0003). Enforce centralized limits: max **Target net**, max allowance rows, allowance name length.

## Acceptance criteria

- [ ] Share copies a URL that restores inputs on load
- [ ] Shared links work in a fresh browser tab without account
- [ ] URL stays within practical length
- [ ] Invalid query params fall back safely with a message

## Blocked by

- #5
