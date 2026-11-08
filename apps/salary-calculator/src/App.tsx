import { useCallback, useEffect, useMemo, useState } from "react";
import { solveTargetNet } from "./engine/solveTargetNet";
import type { AllowanceLine, CalculationResult } from "./engine/types";
import { getRatesConfig } from "./rates/kenyaRates";
import { trackCalculate, trackPageView } from "./lib/analytics";
import { formatKes, formatPercent } from "./lib/formatKes";
import { buildShareUrl, decodeFormState, type FormState } from "./lib/urlState";
import "./App.css";

const rates = getRatesConfig();

const emptyAllowance = (): AllowanceLine => ({ label: "", amountKes: 0 });

export default function App() {
  const [form, setForm] = useState<FormState>({
    targetNetKes: "",
    showAllowances: false,
    allowances: [emptyAllowance()],
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [showHow, setShowHow] = useState(false);

  useEffect(() => {
    trackPageView();
    const { state, error } = decodeFormState(window.location.search.replace(/^\?/, ""));
    if (error) setLinkError(error);
    if (state.targetNetKes !== undefined || state.allowances) {
      setForm((prev) => ({
        ...prev,
        ...state,
        allowances: state.allowances ?? prev.allowances,
      }));
    }
  }, []);

  const onCalculate = useCallback(() => {
    setShareCopied(false);
    const target =
      typeof form.targetNetKes === "number"
        ? form.targetNetKes
        : Number.parseInt(String(form.targetNetKes), 10);
    const allowanceLines = form.showAllowances
      ? form.allowances.filter((a) => a.amountKes > 0)
      : [];
    const next = solveTargetNet(target, allowanceLines, rates);
    setResult(next);
    if (next.kind === "success") trackCalculate();
  }, [form]);

  useEffect(() => {
    const { state, error } = decodeFormState(window.location.search.replace(/^\?/, ""));
    if (!error && typeof state.targetNetKes === "number") {
      const allowanceLines = state.allowances ?? [];
      const solved = solveTargetNet(state.targetNetKes, allowanceLines, rates);
      if (solved.kind === "success") setResult(solved);
    }
  }, []);

  const ratesLabel = useMemo(
    () =>
      new Date(rates.effectiveFrom).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  );

  const onShare = async () => {
    const url = buildShareUrl({
      ...form,
      allowances: form.showAllowances
        ? form.allowances.filter((a) => a.amountKes > 0)
        : [],
    });
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Know your gross from your net</p>
        <h1>Kenya Net-to-Gross Salary Calculator</h1>
        <p className="lede">
          For employees on payroll. Enter your desired <strong>net salary</strong> to estimate{" "}
          <strong>gross salary</strong> after PAYE, NSSF, SHIF, and Housing Levy.
        </p>
      </header>

      {linkError && (
        <p className="banner warn" role="status">
          {linkError}
        </p>
      )}

      <section className="card" aria-labelledby="calc-heading">
        <h2 id="calc-heading">Your numbers</h2>
        <label className="field">
          <span>Target net salary (monthly)</span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.targetNetKes}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                targetNetKes: e.target.value === "" ? "" : Number(e.target.value),
              }))
            }
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.showAllowances}
            onChange={(e) => setForm((f) => ({ ...f, showAllowances: e.target.checked }))}
          />
          I get allowances
        </label>

        {form.showAllowances && (
          <div className="allowances">
            {form.allowances.map((row, index) => (
              <div className="allowance-row" key={index}>
                <input
                  aria-label={`Allowance ${index + 1} name`}
                  placeholder="Label (e.g. housing)"
                  value={row.label}
                  onChange={(e) =>
                    setForm((f) => {
                      const allowances = [...f.allowances];
                      allowances[index] = { ...allowances[index], label: e.target.value };
                      return { ...f, allowances };
                    })
                  }
                />
                <input
                  aria-label={`Allowance ${index + 1} amount`}
                  inputMode="numeric"
                  placeholder="KES"
                  value={row.amountKes || ""}
                  onChange={(e) =>
                    setForm((f) => {
                      const allowances = [...f.allowances];
                      allowances[index] = {
                        ...allowances[index],
                        amountKes: e.target.value === "" ? 0 : Number(e.target.value),
                      };
                      return { ...f, allowances };
                    })
                  }
                />
                <button
                  type="button"
                  className="ghost"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      allowances: f.allowances.filter((_, i) => i !== index),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            {form.allowances.length < 10 && (
              <button
                type="button"
                className="ghost"
                onClick={() =>
                  setForm((f) => ({ ...f, allowances: [...f.allowances, emptyAllowance()] }))
                }
              >
                Add allowance
              </button>
            )}
          </div>
        )}

        <div className="actions">
          <button type="button" className="primary" onClick={onCalculate}>
            Calculate
          </button>
          <button type="button" className="secondary" onClick={onShare}>
            Share link
          </button>
          {shareCopied && <span className="copied">Link copied</span>}
        </div>
      </section>

      {result?.kind === "error" && (
        <p className="banner warn" role="alert">
          {result.message}
        </p>
      )}

      {result?.kind === "success" && (
        <section className="card results" aria-live="polite" aria-labelledby="results-heading">
          <h2 id="results-heading">Results</h2>
          <p className="disclaimer">
            <strong>Estimate only</strong> — not tax or legal advice. Rates as of {ratesLabel}.
          </p>

          <dl className="headline">
            <div>
              <dt>Gross salary</dt>
              <dd>{formatKes(result.grossKes)}</dd>
            </div>
            <div>
              <dt>Basic salary</dt>
              <dd>{formatKes(result.basicKes)}</dd>
            </div>
            <div>
              <dt>Net salary (computed)</dt>
              <dd>
                {formatKes(result.breakdown.computedNetKes)}{" "}
                <span className="muted">(target {formatKes(result.targetNetKes)})</span>
              </dd>
            </div>
          </dl>

          {form.showAllowances && form.allowances.some((a) => a.amountKes > 0) && (
            <table>
              <caption>Allowances (taxable cash)</caption>
              <tbody>
                {form.allowances
                  .filter((a) => a.amountKes > 0)
                  .map((a, i) => (
                    <tr key={i}>
                      <th scope="row">{a.label || `Allowance ${i + 1}`}</th>
                      <td>{formatKes(a.amountKes)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          <table>
            <caption>Statutory breakdown (monthly)</caption>
            <tbody>
              <tr>
                <th scope="row">NSSF</th>
                <td>{formatKes(result.breakdown.nssfKes)}</td>
              </tr>
              <tr>
                <th scope="row" colSpan={2} className="note">
                  Some employers compute NSSF on basic pay only; this tool uses total gross.
                </th>
              </tr>
              <tr>
                <th scope="row">SHIF</th>
                <td>{formatKes(result.breakdown.shifKes)}</td>
              </tr>
              <tr>
                <th scope="row">Housing Levy</th>
                <td>{formatKes(result.breakdown.housingLevyKes)}</td>
              </tr>
              <tr>
                <th scope="row">Taxable pay</th>
                <td>{formatKes(result.breakdown.taxablePayKes)}</td>
              </tr>
              <tr>
                <th scope="row">PAYE before relief</th>
                <td>{formatKes(result.breakdown.payeBeforeReliefKes)}</td>
              </tr>
              <tr>
                <th scope="row">Personal relief</th>
                <td>{formatKes(result.breakdown.personalReliefKes)}</td>
              </tr>
              <tr>
                <th scope="row">PAYE payable</th>
                <td>{formatKes(result.breakdown.payePayableKes)}</td>
              </tr>
              <tr>
                <th scope="row">Total deductions</th>
                <td>{formatKes(result.breakdown.totalDeductionsKes)}</td>
              </tr>
              <tr>
                <th scope="row">Effective deduction</th>
                <td>{formatPercent(result.breakdown.effectiveDeductionPercent)}</td>
              </tr>
            </tbody>
          </table>

          <table>
            <caption>Annual equivalents</caption>
            <tbody>
              <tr>
                <th scope="row">Gross salary</th>
                <td>{formatKes(result.grossKes * 12)}</td>
              </tr>
              <tr>
                <th scope="row">Net salary</th>
                <td>{formatKes(result.breakdown.computedNetKes * 12)}</td>
              </tr>
            </tbody>
          </table>

          <button
            type="button"
            className="ghost how-toggle"
            aria-expanded={showHow}
            onClick={() => setShowHow((v) => !v)}
          >
            How this is calculated
          </button>
          {showHow && (
            <div className="how">
              <ol>
                <li>Statutory deductions are taken from total gross (NSSF, SHIF, Housing Levy).</li>
                <li>Taxable pay is gross minus those three deductions.</li>
                <li>
                  PAYE uses published monthly bands, then monthly personal relief is applied.
                </li>
                <li>
                  Allowances are taxable cash inside gross; basic salary is gross minus allowances.
                </li>
              </ol>
              <p>
                <a href="https://www.kra.go.ke/individual/filing-paying/types-of-taxes/individual-income-tax">
                  KRA individual income tax guidance
                </a>
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
