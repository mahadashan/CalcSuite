"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { InputField } from "@/components/InputField";
import { ResultsCard } from "@/components/ResultsCard";
import { FAQSection } from "@/components/FAQSection";
import { RotateCcw } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
const fmtPct = (v: number) => `${v.toFixed(2)}%`;

const DEFAULTS = { initialInvestment: "10000", finalValue: "15000", years: "3", additionalCosts: "0" };

const FAQ_ITEMS = [
  { question: "How do you calculate ROI?", answer: "Basic ROI = (Net Profit / Cost of Investment) × 100. For example, if you invest $10,000 and earn $15,000, your ROI is ($5,000 / $10,000) × 100 = 50%. Annualized ROI adjusts for the time period using: Annualized ROI = (1 + ROI)^(1/years) - 1." },
  { question: "What is a good ROI?", answer: "It depends on the investment type. Stock market (S&P 500): ~10% per year historically. Real estate: 8–15% per year (varies widely). High-yield savings: 4–5% (2024). Startups: can be 10x–100x or complete loss. Always compare to your benchmark." },
  { question: "What is annualized ROI and why does it matter?", answer: "Annualized ROI (also called Compound Annual Growth Rate or CAGR) normalizes returns across different time periods, letting you compare investments fairly. A 50% return over 3 years is very different from a 50% annual return." },
  { question: "How does this differ from IRR?", answer: "ROI is simpler: it compares final value to initial cost. IRR (Internal Rate of Return) accounts for the timing of all cash flows in and out. For simple buy-and-hold investments, ROI and CAGR are sufficient." },
  { question: "What costs should I include?", answer: "Include any costs directly associated with the investment: brokerage fees, management fees, maintenance costs (real estate), taxes on gains. This gives you a true net ROI rather than gross ROI." },
];

const RELATED = [
  { href: "/calculators/compound-interest-calculator", label: "Compound Interest", description: "Future value of investments" },
  { href: "/calculators/retirement-calculator", label: "Retirement Calculator", description: "Long-term wealth projections" },
  { href: "/calculators/break-even-calculator", label: "Break-Even Calculator", description: "Business profitability analysis" },
];

export default function ROICalculatorPage() {
  const [vals, setVals] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (v: string) => setVals((p) => ({ ...p, [k]: v }));
  const reset = () => setVals(DEFAULTS);

  const calc = useMemo(() => {
    const initial = parseFloat(vals.initialInvestment) || 0;
    const final = parseFloat(vals.finalValue) || 0;
    const years = parseFloat(vals.years) || 1;
    const costs = parseFloat(vals.additionalCosts) || 0;
    const totalCost = initial + costs;
    const netProfit = final - totalCost;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    const annualizedROI = totalCost > 0 ? (Math.pow(final / totalCost, 1 / years) - 1) * 100 : 0;
    return { netProfit, roi, annualizedROI, totalCost, final };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Investment Return (ROI) Calculator"
      description="Calculate your investment return on investment (ROI) and annualized CAGR. Compare any two investments by normalizing returns over different time periods."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 space-y-4 h-fit" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Investment Details</h2>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ color: "#6b7280", background: "rgba(30,58,112,0.3)" }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <InputField id="initialInvestment" label="Initial Investment" value={vals.initialInvestment} onChange={set("initialInvestment")} prefix="$" />
          <InputField id="finalValue" label="Final Value" value={vals.finalValue} onChange={set("finalValue")} prefix="$" tooltip="The value of your investment at exit/sale" />
          <InputField id="years" label="Investment Period" value={vals.years} onChange={set("years")} suffix="years" min={0.1} step={0.5} />
          <InputField id="additionalCosts" label="Additional Costs / Fees" value={vals.additionalCosts} onChange={set("additionalCosts")} prefix="$" tooltip="Commissions, maintenance, taxes, etc." />
        </div>
        <div className="lg:col-span-3 space-y-5">
          <ResultsCard results={[
            { label: "Total ROI", value: fmtPct(calc.roi), highlight: true },
            { label: "Annualized Return (CAGR)", value: fmtPct(calc.annualizedROI) },
            { label: "Net Profit", value: fmt(calc.netProfit) },
            { label: "Total Cost Basis", value: fmt(calc.totalCost) },
          ]} />
          <div className="ad-slot">Advertisement</div>
          <div className="rounded-2xl p-6" style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(30,58,112,0.3)" }}>
            <h3 className="text-sm font-bold text-white mb-4">Return Summary</h3>
            {[
              { label: "Initial Investment", value: fmt(parseFloat(vals.initialInvestment) || 0), color: "#9ca3af" },
              { label: "Additional Costs", value: fmt(parseFloat(vals.additionalCosts) || 0), color: "#9ca3af" },
              { label: "Final Value", value: fmt(calc.final), color: "#00d084" },
              { label: "Net Gain/Loss", value: fmt(calc.netProfit), color: calc.netProfit >= 0 ? "#00d084" : "#f87171" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(30,58,112,0.2)" }}>
                <span className="text-sm" style={{ color: "#9ca3af" }}>{r.label}</span>
                <span className="text-sm font-semibold" style={{ color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">How to Calculate ROI</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          Return on Investment (ROI) measures the gain or loss generated relative to the amount invested. The basic formula is: ROI = (Net Profit / Total Cost) × 100. For multi-year investments, the Compound Annual Growth Rate (CAGR) normalizes the return to an annual rate.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          Always include all costs — purchase price, fees, and any ongoing costs — to get an accurate picture of your real return. A 30% gross return with 10% in fees and taxes is only a 20% net return.
        </p>
      </article>
      <FAQSection items={FAQ_ITEMS} pageName="ROI Calculator" />
    </CalculatorLayout>
  );
}
