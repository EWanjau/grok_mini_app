# Kenya net-to-gross salary calculator

A mobile-friendly web tool for Kenyan payroll employees who know their desired take-home pay and need the corresponding gross (and basic) to negotiate or sanity-check offers.

## Language

**Net salary**:
Monthly take-home pay after PAYE, NSSF, SHIF, and Housing Levy only—not after loans, SACCO, insurance, pension top-ups, or other employer-specific deductions.
_Avoid_: Take-home, net pay (fine in UI copy but use **Net salary** in specs and code names)

**Gross salary**:
Total monthly cash compensation before statutory deductions; the headline figure the solver targets and the user may quote when negotiating.
_Avoid_: Gross pay, total package (package often implies benefits in kind, which v1 excludes)

**Basic salary**:
Gross salary minus the sum of user-entered monthly allowances; when no allowances are entered, basic equals gross.
_Avoid_: Base pay (ambiguous with “basic” in HR forms)

**Allowance**:
A fixed monthly cash amount the user adds as a line item; taxable as part of gross in v1.
_Avoid_: Benefit, perk (v1 does not model benefits in kind)

**Statutory deduction**:
One of PAYE, NSSF, SHIF, or Housing Levy computed from the rates config.
_Avoid_: Withholding (too generic)

**Taxable pay**:
Gross salary minus NSSF, SHIF, and Housing Levy; the amount PAYE bands apply to before personal relief.
_Avoid_: Taxable income (statute may say “taxable income”; in this product use **Taxable pay** consistently)

**Personal relief**:
A fixed monthly amount subtracted from computed PAYE (never below zero), as defined in the rates config.
_Avoid_: Tax credit (not how Kenyan payroll discourse usually labels it)

**Rates config**:
The single source of truth for band thresholds, percentages, caps, relief, minimums, and the effective date shown on results.
_Avoid_: Hard-coded constants scattered in the engine

**Target net**:
The net salary amount the user enters; the solver searches for a gross that reproduces it to the nearest shilling.
_Avoid_: Desired salary (ambiguous with gross)

**Computed net**:
The net salary produced by running the forward engine on solved gross; may differ from **Target net** by at most 1 KES because of per-line rounding.
_Avoid_: Actual net (sounds like a bank balance)

**Pensionable pay** (v1):
In this product, identical to **Gross salary** for NSSF calculation—not basic salary only.
_Avoid_: Pensionable emoluments (statutory phrase; use in disclaimer only if quoting law)

**Calculation**:
One run of the engine from a **Target net** (plus optional allowances) to solved **Gross salary**, **Basic salary**, and statutory breakdown; may be reflected in the URL for sharing but is never stored on a server in v1.
_Avoid_: Session, saved result
