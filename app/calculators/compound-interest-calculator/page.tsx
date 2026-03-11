"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { InputField } from "@/components/InputField";
import { ResultsCard } from "@/components/ResultsCard";
import { FinancialChart } from "@/components/FinancialChart";
import { FAQSection } from "@/components/FAQSection";
import { RotateCcw } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const DEFAULTS = {
  principal: "10000",
  annualRate: "8",
  years: "10",
  compoundFreq: "12",
  monthlyContribution: "200",
};

const FAQ_ITEMS = [
  {
    question: "What is the compound interest formula?",
    answer: "The formula is A = P(1 + r/n)^(nt), where A is the final amount, P is the principal, r is the annual interest rate (as a decimal), n is the number of times interest compounds per year, and t is time in years. With monthly contributions, each contribution compounds for its remaining time.",
  },
  {
    question: "How often should interest compound?",
    answer: "Most savings accounts and investments compound monthly (12x/year) or daily (365x/year). The difference between monthly and daily compounding is small on moderate sums. What matters most is a high rate and consistent contributions.",
  },
  {
    question: "What's a realistic rate of return?",
    answer: "High-yield savings accounts: 4–5% (2024). CD rates: 4–5.5%. S&P 500 historical average: ~10% nominal, ~7% real. Conservative bond portfolio: 3–5%. Always use realistic, conservative estimates for retirement planning.",
  },
  {
    question: "Why are monthly contributions so powerful?",
    answer: "Each contribution you make earns compound interest for the remainder of your investment period. Early contributions earn exponentially more than later ones — this is why starting early is the single most important factor in building wealth.",
  },
  {
    question: "What is the Rule of 72?",
    answer: "The Rule of 72 is a quick mental math shortcut: divide 72 by your annual interest rate to estimate how many years it takes to double your money. At 8% interest, your money doubles roughly every 9 years (72 ÷ 8 = 9).",
  },
];

const RELATED = [
  { href: "/calculators/retirement-calculator", label: "Retirement Calculator", description: "Long-term savings with inflation" },
  { href: "/calculators/savings-goal-calculator", label: "Savings Goal", description: "How long to reach your target" },
  { href: "/calculators/roi-calculator", label: "ROI Calculator", description: "Investment return analysis" },
  { href: "/calculators/simple-interest-calculator", label: "Simple Interest", description: "Basic interest calculation" },
];

export default function CompoundInterestPage() {
  const [vals, setVals] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (v: string) => setVals((p) => ({ ...p, [k]: v }));
  const reset = () => setVals(DEFAULTS);

  const calc = useMemo(() => {
    const P = parseFloat(vals.principal) || 0;
    const r = parseFloat(vals.annualRate) / 100 || 0;
    const t = parseFloat(vals.years) || 0;
    const n = parseFloat(vals.compoundFreq) || 12;
    const pmt = parseFloat(vals.monthlyContribution) || 0;

    // Principal compounded
    const principalFV = P * Math.pow(1 + r / n, n * t);

    // Monthly contribution FV (annuity)
    let contributionFV = 0;
    if (r > 0) {
      const monthlyRate = r / 12;
      const months = t * 12;
      contributionFV = pmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else {
      contributionFV = pmt * t * 12;
    }

    const totalFV = principalFV + contributionFV;
    const totalContributions = P + pmt * t * 12;
    const totalInterest = totalFV - totalContributions;

    // Yearly data
    const yearlyLabels: string[] = [];
    const yearlyTotal: number[] = [];
    const yearlyPrincipal: number[] = [];
    const yearlyInterest: number[] = [];

    for (let y = 1; y <= t; y++) {
      const pFV = P * Math.pow(1 + r / n, n * y);
      let cFV = 0;
      if (r > 0) {
        const mr = r / 12;
        cFV = pmt * ((Math.pow(1 + mr, y * 12) - 1) / mr);
      } else {
        cFV = pmt * y * 12;
      }
      const total = pFV + cFV;
      const contrib = P + pmt * y * 12;
      yearlyLabels.push(`Yr ${y}`);
      yearlyTotal.push(total);
      yearlyPrincipal.push(contrib);
      yearlyInterest.push(total - contrib);
    }

    return { totalFV, totalContributions, totalInterest, yearlyLabels, yearlyTotal, yearlyPrincipal, yearlyInterest };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Compound Interest Calculator with Monthly Contributions"
      description="Calculate how your money grows over time with compound interest and regular monthly deposits. See year-by-year projection charts for any investment or savings account."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 space-y-4 h-fit" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Calculator Inputs</h2>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ color: "#6b7280", background: "rgba(30,58,112,0.3)" }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <InputField id="principal" label="Initial Investment" value={vals.principal} onChange={set("principal")} prefix="$" tooltip="Your starting lump sum" />
          <InputField id="annualRate" label="Annual Interest Rate" value={vals.annualRate} onChange={set("annualRate")} suffix="%" step={0.1} tooltip="Expected annual return (S&P 500 avg: ~10%)" />
          <InputField id="years" label="Investment Period" value={vals.years} onChange={set("years")} suffix="years" min={1} max={50} />
          <InputField id="compoundFreq" label="Compound Frequency" value={vals.compoundFreq} onChange={set("compoundFreq")} suffix="×/yr" tooltip="12 = monthly, 365 = daily, 4 = quarterly" />
          <InputField id="monthlyContribution" label="Monthly Contribution" value={vals.monthlyContribution} onChange={set("monthlyContribution")} prefix="$" tooltip="How much you add each month" />
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultsCard results={[
            { label: "Final Balance", value: fmt(calc.totalFV), highlight: true },
            { label: "Total Contributions", value: fmt(calc.totalContributions) },
            { label: "Interest Earned", value: fmt(calc.totalInterest), sub: `${((calc.totalInterest / calc.totalFV) * 100).toFixed(0)}% of final balance` },
          ]} />
          <div className="ad-slot">Advertisement</div>
          <FinancialChart type="bar" title="Balance Growth Over Time" data={{
            labels: calc.yearlyLabels,
            datasets: [
              { label: "Contributions", data: calc.yearlyPrincipal, color: "#3b82f6" },
              { label: "Interest Earned", data: calc.yearlyInterest, color: "#00d084" },
            ],
          }} />
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">Understanding Compound Interest</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          Compound interest is the process of earning interest on both your original investment and any previously accumulated interest. Unlike simple interest, compound interest grows exponentially — your gains generate their own gains over time.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          The formula A = P(1 + r/n)^(nt) captures this: P is your principal, r is the annual rate (as decimal), n is compounding frequency per year, and t is years. Monthly contributions dramatically accelerate growth because each deposit begins earning compound returns immediately.
        </p>
      </article>

      <FAQSection items={FAQ_ITEMS} pageName="Compound Interest Calculator" />
    </CalculatorLayout>
  );
}
