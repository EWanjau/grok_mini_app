export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}
