import { roundKes } from "./roundKes";
import type { RatesConfig, StatutoryBreakdown } from "./types";

function payeBeforeRelief(taxablePayKes: number, rates: RatesConfig): number {
  let remaining = taxablePayKes;
  let tax = 0;
  for (const band of rates.payeBands) {
    if (remaining <= 0) break;
    const slice = Math.min(remaining, band.widthKes);
    tax += slice * band.rate;
    remaining -= slice;
  }
  if (remaining > 0) {
    tax += remaining * rates.payeTopRate;
  }
  return roundKes(tax);
}

export function grossToNet(grossKes: number, rates: RatesConfig): StatutoryBreakdown {
  const nssfKes = roundKes(Math.min(grossKes * rates.nssfRate, rates.nssfCapKes));
  const shifUncapped = grossKes * rates.shifRate;
  const shifKes = roundKes(Math.max(shifUncapped, rates.shifMinimumKes));
  const housingLevyKes = roundKes(grossKes * rates.housingLevyRate);
  const taxablePayKes = grossKes - nssfKes - shifKes - housingLevyKes;
  const payeBeforeReliefKes = payeBeforeRelief(Math.max(0, taxablePayKes), rates);
  const payePayableKes = Math.max(
    0,
    roundKes(payeBeforeReliefKes - rates.personalReliefKes),
  );
  const totalDeductionsKes = nssfKes + shifKes + housingLevyKes + payePayableKes;
  const computedNetKes = grossKes - totalDeductionsKes;
  const effectiveDeductionPercent =
    grossKes > 0 ? roundKes((totalDeductionsKes / grossKes) * 10_000) / 100 : 0;

  return {
    grossKes,
    nssfKes,
    shifKes,
    housingLevyKes,
    taxablePayKes,
    payeBeforeReliefKes,
    personalReliefKes: rates.personalReliefKes,
    payePayableKes,
    totalDeductionsKes,
    computedNetKes,
    effectiveDeductionPercent,
  };
}
