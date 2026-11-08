Part of #1

## What to build

Optional **Allowance** line items: toggle, add, remove. **Basic salary** = **Gross salary** minus sum of allowances; all taxable cash in gross. Friendly errors when allowances meet or exceed solved gross or inputs violate spec caps.

## Acceptance criteria

- [ ] User can add, edit, and remove up to 10 allowance rows
- [ ] **Basic salary** and **Gross salary** shown when allowances are used
- [ ] Error when allowances too high for **Target net**
- [ ] Input validation before Calculate
- [ ] Vitest covers solve + forward with multiple allowances

## Blocked by

- #3
