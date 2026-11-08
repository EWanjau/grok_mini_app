Part of #1

## What to build

A runnable Vite + TypeScript app with **Rates config** (including `effectiveFrom`) and a forward engine that, given **Gross salary**, computes all **Statutory deduction** lines, **Taxable pay**, PAYE, and **Computed net** using nearest-shilling rounding (ADR-0002). NSSF, SHIF, and Housing Levy use **total Gross salary** as **Pensionable pay** (ADR-0001). Minimal UI: enter gross, see **Computed net** and line-item breakdown. Vitest covers the engine seam (band edges, NSSF cap, SHIF floor).

## Acceptance criteria

- [ ] App installs and runs locally
- [ ] **Rates config** holds bands, percentages, caps, relief, minimums, and effective date
- [ ] Forward engine returns full breakdown for a test gross
- [ ] Vitest passes for PAYE bands, NSSF cap, and SHIF minimum cases
- [ ] Minimal UI demonstrates gross → breakdown without login or backend

## Blocked by

None (can start immediately).
