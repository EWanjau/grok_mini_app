import type { AllowanceLine } from "../engine/types";
import { MAX_ALLOWANCE_ROWS, MAX_TARGET_NET_KES } from "../engine/solveTargetNet";

export type FormState = {
  targetNetKes: number | "";
  showAllowances: boolean;
  allowances: AllowanceLine[];
};

export function encodeFormState(state: FormState): string {
  const params = new URLSearchParams();
  if (state.targetNetKes !== "" && state.targetNetKes > 0) {
    params.set("net", String(state.targetNetKes));
  }
  if (state.showAllowances && state.allowances.length > 0) {
    const amounts = state.allowances.map((a) => a.amountKes).join(",");
    params.set("a", amounts);
  }
  return params.toString();
}

export function decodeFormState(search: string): { state: Partial<FormState>; error?: string } {
  const params = new URLSearchParams(search);
  const next: Partial<FormState> = {};

  const netRaw = params.get("net");
  if (netRaw !== null) {
    const net = Number(netRaw);
    if (!Number.isInteger(net) || net <= 0 || net > MAX_TARGET_NET_KES) {
      return { state: {}, error: "We could not read the net salary from this link." };
    }
    next.targetNetKes = net;
  }

  const amountsRaw = params.get("a");
  if (amountsRaw) {
    const parts = amountsRaw.split(",").filter(Boolean);
    if (parts.length > MAX_ALLOWANCE_ROWS) {
      return { state: next, error: "This link has too many allowances." };
    }
    const allowances: AllowanceLine[] = [];
    for (let i = 0; i < parts.length; i++) {
      const amountKes = Number(parts[i]);
      if (!Number.isInteger(amountKes) || amountKes <= 0) {
        return { state: next, error: "We could not read allowance amounts from this link." };
      }
      allowances.push({ label: `Allowance ${i + 1}`, amountKes });
    }
    next.allowances = allowances;
    next.showAllowances = true;
  }

  return { state: next };
}

export function buildShareUrl(state: FormState): string {
  const qs = encodeFormState(state);
  const path = import.meta.env.BASE_URL.replace(/\/$/, "") || "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return qs ? `${origin}${path}/?${qs}` : `${origin}${path}/`;
}
