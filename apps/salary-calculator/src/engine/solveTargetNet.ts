import { grossToNet } from "./grossToNet";
import type { AllowanceLine, CalculationResult, RatesConfig } from "./types";

const NET_TOLERANCE_KES = 1;
const MAX_TARGET_NET_KES = 50_000_000;
const MAX_ALLOWANCE_ROWS = 10;
const MAX_ALLOWANCE_LABEL_LENGTH = 40;

export function sumAllowances(allowances: AllowanceLine[]): number {
  return allowances.reduce((sum, line) => sum + line.amountKes, 0);
}

export function validateInputs(
  targetNetKes: number,
  allowances: AllowanceLine[],
): CalculationResult | null {
  if (
    !Number.isInteger(targetNetKes) ||
    targetNetKes <= 0 ||
    targetNetKes > MAX_TARGET_NET_KES
  ) {
    return {
      kind: "error",
      code: "INVALID_INPUT",
      message: "Enter a whole-number target net between 1 and 50,000,000 KES.",
    };
  }
  if (allowances.length > MAX_ALLOWANCE_ROWS) {
    return {
      kind: "error",
      code: "INVALID_INPUT",
      message: `You can add at most ${MAX_ALLOWANCE_ROWS} allowances.`,
    };
  }
  for (const line of allowances) {
    if (line.label.length > MAX_ALLOWANCE_LABEL_LENGTH) {
      return {
        kind: "error",
        code: "INVALID_INPUT",
        message: `Allowance names must be ${MAX_ALLOWANCE_LABEL_LENGTH} characters or fewer.`,
      };
    }
    if (!Number.isInteger(line.amountKes) || line.amountKes <= 0) {
      return {
        kind: "error",
        code: "INVALID_INPUT",
        message: "Each allowance must be a positive whole number of KES.",
      };
    }
  }
  return null;
}

function findGrossForTargetNet(
  targetNetKes: number,
  rates: RatesConfig,
): number | null {
  let lo = Math.max(1, targetNetKes);
  let hi = Math.max(lo * 4, 500_000);
  while (
    grossToNet(hi, rates).computedNetKes < targetNetKes - NET_TOLERANCE_KES &&
    hi < MAX_TARGET_NET_KES
  ) {
    hi = Math.min(hi * 2, MAX_TARGET_NET_KES);
  }
  if (grossToNet(hi, rates).computedNetKes < targetNetKes - NET_TOLERANCE_KES) {
    return null;
  }

  let bestGross: number | null = null;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const net = grossToNet(mid, rates).computedNetKes;
    const diff = net - targetNetKes;
    if (Math.abs(diff) <= NET_TOLERANCE_KES) {
      bestGross = mid;
      hi = mid - 1;
    } else if (net < targetNetKes) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return bestGross;
}

export function solveTargetNet(
  targetNetKes: number,
  allowances: AllowanceLine[],
  rates: RatesConfig,
): CalculationResult {
  const validationError = validateInputs(targetNetKes, allowances);
  if (validationError) return validationError;

  const allowanceTotalKes = sumAllowances(allowances);
  const grossKes = findGrossForTargetNet(targetNetKes, rates);
  if (grossKes === null) {
    return {
      kind: "error",
      code: "INFEASIBLE_TARGET_NET",
      message:
        "This target net is too low for the statutory minimums in this model. Try a higher amount.",
    };
  }
  if (allowanceTotalKes >= grossKes) {
    return {
      kind: "error",
      code: "ALLOWANCES_TOO_HIGH",
      message: "Allowances are too high for this net salary — they must be less than gross.",
    };
  }

  const breakdown = grossToNet(grossKes, rates);
  const basicKes = grossKes - allowanceTotalKes;

  return {
    kind: "success",
    grossKes,
    basicKes,
    allowanceTotalKes,
    breakdown,
    targetNetKes,
  };
}

export { MAX_ALLOWANCE_LABEL_LENGTH, MAX_ALLOWANCE_ROWS, MAX_TARGET_NET_KES };
