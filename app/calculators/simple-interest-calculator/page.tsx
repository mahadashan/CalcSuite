"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { InputField } from "@/components/InputField";
import { ResultsCard } from "@/components/ResultsCard";
import { FAQSection } from "@/components/FAQSection";
import { RotateCcw } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

const DEFAULTS = { principal: "5000", rate: "6", time: "3" };

const FAQ_ITEMS = [
  { question: "What is the simple interest formula?", answer: "Simple interest is calculated as I = P × r × t, where P is the principal, r is the annual interest rate (as a decimal), and t is the time in years. Total amount = P + I = P(1 + rt). Unlike compound interest, simple interest only earns on the original principal." },
  { question: "When is simple interest used?", answer: "Simple interest is commonly used for: car loans, personal loans, short-term business loans, Treasury bills, and some bonds. Most savings accounts and mortgages use compound interest instead." },
  { question: "How is simple interest different from compound interest?", answer: "Simple interest is calculated only on the principal. Compound interest is calculated on the principal plus any accumulated interest. For longer time periods, compound interest grows significantly faster." },
  { question: "What's a realistic simple interest rate?", answer: "Personal loans: 8–36% APR. Car loans: 4–10% APR. Short-term business loans: 7–25%. Treasury Bills (6-month): ~5% (2024). The rate depends heavily on creditworthiness, loan type, and market conditions." },
  { question: "Can I use simple interest for investments?", answer: "Most investments use compound interest (better for growth). Simple interest calculations are primarily useful for understanding short-term loan costs quickly, or for specific financial instruments like T-bills that pay interest at maturity." },
];

const RELATED = [
  { href: "/calculators/compound-interest-calculator", label: "Compound Interest", description: "Growth with compounding" },
  { href: "/calculators/loan-calculator", label: "Loan Calculator", description: "Amortized loan payments" },
  { href: "/calculators/savings-goal-calculator", label: "Savings Goal", description: "How long to reach your target" },
];

export default function SimpleInterestPage() {
  const [vals, setVals] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (v: string) => setVals((p) => ({ ...p, [k]: v }));

  const calc = useMemo(() => {
    const P = parseFloat(vals.principal) || 0;
    const r = parseFloat(vals.rate) / 100 || 0;
    const t = parseFloat(vals.time) || 0;
    const interest = P * r * t;
    const total = P + interest;
    return { interest, total, dailyInterest: interest / (t * 365), monthlyInterest: interest / (t * 12) };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Simple Interest Calculator"
      description="Calculate simple interest using I = Prt. Instant results showing interest earned, total amount, and daily/monthly breakdowns."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 space-y-4 h-fit" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Simple Interest Inputs</h2>
            <button onClick={() => setVals(DEFAULTS)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ color: "#6b7280", background: "rgba(30,58,112,0.3)" }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <InputField id="principal" label="Principal (P)" value={vals.principal} onChange={set("principal")} prefix="$" tooltip="The original amount borrowed or invested" />
          <InputField id="rate" label="Annual Interest Rate (r)" value={vals.rate} onChange={set("rate")} suffix="%" step={0.1} tooltip="The annual rate expressed as a percentage" />
          <InputField id="time" label="Time Period (t)" value={vals.time} onChange={set("time")} suffix="years" step={0.5} min={0.1} tooltip="The duration of the loan or investment" />
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultsCard results={[
            { label: "Total Interest (I = Prt)", value: fmt(calc.interest), highlight: true },
            { label: "Total Amount (A = P + I)", value: fmt(calc.total) },
            { label: "Monthly Interest", value: fmt(calc.monthlyInterest) },
            { label: "Daily Interest", value: fmt(calc.dailyInterest) },
          ]} />
          <div className="ad-slot">Advertisement</div>
          <div className="rounded-2xl p-6" style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(30,58,112,0.3)" }}>
            <h3 className="text-sm font-bold text-white mb-4">Formula Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: "I = P × r × t", value: `$${parseFloat(vals.principal)||0} × ${parseFloat(vals.rate)/100||0} × ${parseFloat(vals.time)||0} = ${fmt(calc.interest)}` },
                { label: "A = P + I", value: `${fmt(parseFloat(vals.principal)||0)} + ${fmt(calc.interest)} = ${fmt(calc.total)}` },
              ].map((r) => (
                <div key={r.label} className="rounded-lg p-3" style={{ background: "rgba(15,32,66,0.6)" }}>
                  <div className="text-xs font-mono mb-1" style={{ color: "#00d084" }}>{r.label}</div>
                  <div className="text-sm" style={{ color: "#9ca3af" }}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">Simple Interest Formula: I = Prt</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          Simple interest calculates interest only on the original principal — it does not compound. The formula is I = Prt, where I is interest, P is principal, r is the annual rate (decimal), and t is time in years.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          For example: $5,000 at 6% simple interest over 3 years earns $5,000 × 0.06 × 3 = $900 in interest, for a total of $5,900. With compound interest at the same rate, you&apos;d end up with $5,955.08 — showing that compounding is always better for investors.
        </p>
      </article>
      <FAQSection items={FAQ_ITEMS} pageName="Simple Interest Calculator" />
    </CalculatorLayout>
  );
}
