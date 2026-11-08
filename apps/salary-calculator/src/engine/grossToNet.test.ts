import { describe, expect, it } from "vitest";
import { getRatesConfig } from "../rates/kenyaRates";
import { grossToNet } from "./grossToNet";
import { solveTargetNet } from "./solveTargetNet";

const rates = getRatesConfig();

describe("grossToNet", () => {
  it("applies SHIF minimum on low gross", () => {
    const b = grossToNet(5_000, rates);
    expect(b.shifKes).toBe(300);
  });

  it("caps NSSF at configured maximum", () => {
    const b = grossToNet(500_000, rates);
    expect(b.nssfKes).toBe(rates.nssfCapKes);
  });

  it("applies personal relief so PAYE payable is zero on low taxable pay", () => {
    const b = grossToNet(15_000, rates);
    expect(b.payePayableKes).toBe(0);
  });

  it("steps PAYE across the first band boundary", () => {
    const below = grossToNet(50_000, rates);
    const above = grossToNet(55_000, rates);
    expect(above.payePayableKes).toBeGreaterThan(below.payePayableKes);
  });
});

describe("solveTargetNet round-trip", () => {
  it("finds gross so computed net matches target net within 1 KES", () => {
    const target = 85_000;
    const result = solveTargetNet(target, [], rates);
    expect(result.kind).toBe("success");
    if (result.kind === "success") {
      expect(Math.abs(result.breakdown.computedNetKes - target)).toBeLessThanOrEqual(1);
    }
  });

  it("round-trips with allowances", () => {
    const target = 120_000;
    const result = solveTargetNet(
      target,
      [
        { label: "Housing", amountKes: 20_000 },
        { label: "Transport", amountKes: 5_000 },
      ],
      rates,
    );
    expect(result.kind).toBe("success");
    if (result.kind === "success") {
      expect(result.basicKes).toBe(result.grossKes - 25_000);
      expect(Math.abs(result.breakdown.computedNetKes - target)).toBeLessThanOrEqual(1);
    }
  });

  it("rejects allowances greater than or equal to gross", () => {
    const result = solveTargetNet(
      30_000,
      [{ label: "All", amountKes: 200_000 }],
      rates,
    );
    expect(result.kind).toBe("error");
    if (result.kind === "error") {
      expect(result.code).toBe("ALLOWANCES_TOO_HIGH");
    }
  });
});
