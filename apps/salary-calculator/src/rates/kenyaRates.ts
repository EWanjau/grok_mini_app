import type { RatesConfig } from "../engine/types";

/** Monthly PAYE bands from Finance Act 2023 (effective July 2023), per KRA. */
export const kenyaRates: RatesConfig = {
  effectiveFrom: "2023-07-01",
  payeBands: [
    { widthKes: 24_000, rate: 0.1 },
    { widthKes: 8_333, rate: 0.25 },
    { widthKes: 467_667, rate: 0.3 },
    { widthKes: 300_000, rate: 0.325 },
  ],
  payeTopRate: 0.35,
  personalReliefKes: 2_400,
  nssfRate: 0.06,
  nssfCapKes: 6_480,
  shifRate: 0.0275,
  shifMinimumKes: 300,
  housingLevyRate: 0.015,
};

export function getRatesConfig(): RatesConfig {
  return kenyaRates;
}
