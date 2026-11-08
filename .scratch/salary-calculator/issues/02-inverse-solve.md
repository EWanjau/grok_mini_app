# 02: Inverse solve: Target net → Gross salary (no allowances)

**What to build:** User enters **Target net**; binary search finds **Gross salary** with **Basic salary** equal to gross (no **Allowance** rows yet). Results show **Computed net** versus **Target net** within 1 KES (ADR-0002). Infeasible targets return a clear error. Vitest round-trip suite: solve then forward.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] UI accepts **Target net** and displays solved **Gross salary**
- [ ] **Computed net** within 1 KES of **Target net** on happy path
- [ ] Infeasible **Target net** shows friendly error
- [ ] Vitest round-trip tests pass without allowances
