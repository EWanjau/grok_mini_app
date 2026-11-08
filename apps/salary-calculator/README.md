# Kenya Net-to-Gross Salary Calculator

Mobile-friendly SPA for payroll employees. See repo root [GLOSSARY.md](../../GLOSSARY.md) and GitHub spec issue #1.

## Develop

```bash
npm ci
npm run dev
npm test
```

## Deploy

Pushing to `main` runs [.github/workflows/deploy-salary-calculator.yml](../../.github/workflows/deploy-salary-calculator.yml) to GitHub Pages with base path `/grok_mini_app/`.

**Public URL (after Pages is enabled):** `https://EWanjau.github.io/grok_mini_app/`

Enable **Settings → Pages → GitHub Actions** on the repository once.

## Rates

Edit `src/rates/kenyaRates.ts` after each Finance Act or February NSSF update; bump `effectiveFrom`.

## Analytics

Set `VITE_PLAUSIBLE_DOMAIN` at build time to enable Plausible. Only `pageview` and `calculate` events are sent—never salary amounts.
