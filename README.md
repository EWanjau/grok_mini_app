# Kenya Net-to-Gross Salary Calculator

Know your **gross salary** from your **net salary**. Built for Kenyan employees on payroll—not casual or self-employed workers.

The app estimates gross (and basic, when you add cash allowances) after **PAYE, NSSF, SHIF, and Housing Levy** only. It is not tax or legal advice.

## Run locally

```bash
cd apps/salary-calculator
npm ci
npm run dev
```

Open the URL Vite prints (includes `/grok_mini_app/`).

```bash
npm test
```

## Update tax rates

Edit `apps/salary-calculator/src/rates/kenyaRates.ts` and set `effectiveFrom` when bands or statutory rates change.
