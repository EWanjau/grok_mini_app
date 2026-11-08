import { describe, expect, it } from "vitest";
import { decodeFormState, encodeFormState } from "./urlState";

describe("urlState", () => {
  it("round-trips target net and allowance amounts", () => {
    const qs = encodeFormState({
      targetNetKes: 75_000,
      showAllowances: true,
      allowances: [
        { label: "Housing", amountKes: 10_000 },
        { label: "Travel", amountKes: 5_000 },
      ],
    });
    const { state, error } = decodeFormState(qs);
    expect(error).toBeUndefined();
    expect(state.targetNetKes).toBe(75_000);
    expect(state.allowances?.map((a) => a.amountKes)).toEqual([10_000, 5_000]);
  });
});
