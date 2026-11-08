Part of #1

## What to build

Ship the static build to GitHub Pages with Vite base `/grok_mini_app/`, workflow on push to `main`. Wire privacy-light analytics: page view and `calculate` only—never salary amounts (ADR-0003).

## Acceptance criteria

- [ ] CI builds and deploys the SPA to GitHub Pages from `main`
- [ ] Production URL loads the calculator successfully
- [ ] Analytics events fire without salary fields in payloads
- [ ] README or docs note the public URL and how to update **Rates config**

## Blocked by

- #6
