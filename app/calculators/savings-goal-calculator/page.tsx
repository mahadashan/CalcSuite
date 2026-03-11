"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { InputField } from "@/components/InputField";
import { ResultsCard } from "@/components/ResultsCard";
import { FAQSection } from "@/components/FAQSection";
import { RotateCcw } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const DEFAULTS = { goalAmount: "10000", currentSavings: "1000", monthlyContrib: "400", annualRate: "5" };

const FAQ_ITEMS = [
  { question: "How long does it take to save $10,000?", answer: "It depends on your monthly contribution and interest rate. Saving $400/month in a 5% APY account starting from $1,000 takes approximately 20 months. Without interest, pure $400/month savings would take 22.5 months." },
  { question: "What savings account gives the best returns?", answer: "High-yield savings accounts (HYSAs) in 2024 offer 4.5–5.5% APY. Money Market accounts offer similar rates. CDs can lock in rates for 6–24 months. Regular savings accounts at big banks pay as little as 0.01–0.5% — avoid these for your emergency fund." },
  { question: "Should I invest instead of saving toward a goal?", answer: "For goals under 3 years, keep money in a HYSA — market volatility is too risky for short-term goals. For 3–5 year goals, a conservative mix of bonds and stocks may be appropriate. For 5+ year goals, a diversified investment portfolio likely outperforms savings accounts." },
  { question: "What's the fastest way to reach a savings goal?", answer: "Three levers: (1) Increase monthly contributions — even $50 more/month matters significantly; (2) Find a higher-yield account; (3) Start with a bigger initial deposit. The calculator shows how each variable impacts your timeline." },
  { question: "Can I calculate how much to save per month to hit a goal by a target date?", answer: "Yes — simply adjust your monthly contribution input until the 'time to goal' matches your desired timeline. If you want to save $20,000 in 24 months, divide the gap by your timeline as a starting point and fine-tune from there." },
];

const RELATED = [
  { href: "/calculators/compound-interest-calculator", label: "Compound Interest", description: "See long-term growth potential" },
  { href: "/calculators/emergency-fund-calculator", label: "Emergency Fund", description: "How much buffer you need" },
  { href: "/calculators/budget-calculator", label: "Budget Calculator", description: "Find monthly savings capacity" },
];

export default function SavingsGoalPage() {
  const [vals, setVals] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (v: string) => setVals((p) => ({ ...p, [k]: v }));
  const reset = () => setVals(DEFAULTS);

  const calc = useMemo(() => {
    const goal = parseFloat(vals.goalAmount) || 0;
    const current = parseFloat(vals.currentSavings) || 0;
    const pmt = parseFloat(vals.monthlyContrib) || 0;
    const mr = (parseFloat(vals.annualRate) / 100) / 12;
    if (pmt <= 0 || goal <= current) return null;
    const remaining = goal - current;
    let months = 0;
    let balance = current;
    while (balance < goal && months < 1200) {
      balance = balance * (1 + mr) + pmt;
      months++;
    }
    const totalContributions = current + pmt * months;
    const interestEarned = goal - totalContributions;
    return { months, years: (months / 12).toFixed(1), totalContributions, interestEarned, remaining };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Savings Goal Calculator — How Long to Save Money"
      description="Enter your savings goal and monthly contribution to find out exactly when you'll reach it, including interest earned from high-yield savings accounts."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 space-y-4 h-fit" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Your Savings Goal</h2>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ color: "#6b7280", background: "rgba(30,58,112,0.3)" }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <InputField id="goalAmount" label="Savings Goal" value={vals.goalAmount} onChange={set("goalAmount")} prefix="$" tooltip="The total amount you want to save" />
          <InputField id="currentSavings" label="Current Savings" value={vals.currentSavings} onChange={set("currentSavings")} prefix="$" tooltip="How much you've already saved" />
          <InputField id="monthlyContrib" label="Monthly Contribution" value={vals.monthlyContrib} onChange={set("monthlyContrib")} prefix="$" />
          <InputField id="annualRate" label="Annual Interest Rate (APY)" value={vals.annualRate} onChange={set("annualRate")} suffix="%" step={0.1} tooltip="HYSA rates in 2024: 4.5–5.5% APY" />
        </div>

        <div className="lg:col-span-3 space-y-5">
          {calc ? (
            <ResultsCard results={[
              { label: "Time to Reach Goal", value: `${calc.months} months`, highlight: true, sub: `${calc.years} years` },
              { label: "Total Contributions", value: fmt(calc.totalContributions) },
              { label: "Interest Earned", value: fmt(calc.interestEarned) },
              { label: "Remaining to Save", value: fmt(calc.remaining) },
            ]} />
          ) : (
            <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
              <p style={{ color: "#9ca3af" }}>Adjust your inputs above to calculate your savings timeline.</p>
            </div>
          )}
          <div className="ad-slot">Advertisement</div>
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">How Long Does It Take to Save Money?</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          This reverse savings calculator answers the question: given your goal, current savings, and monthly contribution, exactly when will you hit your target? It factors in compound interest from savings accounts, which can meaningfully shorten your timeline.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          In 2024, high-yield savings accounts offer 4.5–5.5% APY — a far cry from the 0.01% offered by traditional banks. For a $10,000 goal, the difference between 0.5% and 5% APY is meaningful when saving over 12–24 months. Always put savings goals in a HYSA.
        </p>
      </article>
      <FAQSection items={FAQ_ITEMS} pageName="Savings Goal Calculator" />
    </CalculatorLayout>
  );
}
