# Nearest-shilling rounding and net solver tolerance

Each statutory line (NSSF, SHIF, Housing Levy, PAYE before relief, PAYE after relief) is rounded to the nearest whole KES at each step before the next. The net→gross binary search succeeds when |computed net − target net| ≤ 1 KES; the breakdown shows the computed net so any 1 KES gap is visible. This trades perfect equality with some payroll systems for a simple, testable engine and a unique monotonic search.
