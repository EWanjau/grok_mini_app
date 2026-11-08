export type PayeBand = { widthKes: number; rate: number };

export type RatesConfig = {
  effectiveFrom: string;
  payeBands: PayeBand[];
  payeTopRate: number;
  personalReliefKes: number;
  nssfRate: number;
  nssfCapKes: number;
  shifRate: number;
  shifMinimumKes: number;
  housingLevyRate: number;
};

export type StatutoryBreakdown = {
  grossKes: number;
  nssfKes: number;
  shifKes: number;
  housingLevyKes: number;
  taxablePayKes: number;
  payeBeforeReliefKes: number;
  personalReliefKes: number;
  payePayableKes: number;
  totalDeductionsKes: number;
  computedNetKes: number;
  effectiveDeductionPercent: number;
};

export type AllowanceLine = { label: string; amountKes: number };

export type CalculationSuccess = {
  kind: "success";
  grossKes: number;
  basicKes: number;
  allowanceTotalKes: number;
  breakdown: StatutoryBreakdown;
  targetNetKes: number;
};

export type CalculationError = {
  kind: "error";
  code: "INFEASIBLE_TARGET_NET" | "ALLOWANCES_TOO_HIGH" | "INVALID_INPUT";
  message: string;
};

export type CalculationResult = CalculationSuccess | CalculationError;
