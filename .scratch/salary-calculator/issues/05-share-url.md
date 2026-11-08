# 05: Shareable Calculation links and input guards

**What to build:** Query-string share for **Target net** and allowance amounts; no server persistence (ADR-0003). Centralized input limits and safe handling of bad URLs.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] Share copies a URL that restores inputs on load
- [ ] Works in a fresh tab without account
- [ ] URL length stays practical
- [ ] Invalid query params fall back with a message
