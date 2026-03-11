"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { InputField } from "@/components/InputField";
import { ResultsCard } from "@/components/ResultsCard";
import { FAQSection } from "@/components/FAQSection";
import { RotateCcw } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const DEFAULTS = { monthlyExpenses: "3500", monthsCovered: "6" };

const FAQ_ITEMS = [
  { question: "How much emergency fund do I need?", answer: "Most financial advisors recommend 3–6 months of essential living expenses. If you have a stable job in a high-demand field, 3 months may be sufficient. If you're self-employed, have variable income, or work in a volatile industry, aim for 6–12 months." },
  { question: "What counts as monthly expenses for an emergency fund?", answer: "Include only essential expenses: rent/mortgage, utilities, groceries, minimum debt payments, insurance premiums, and transportation. Do not include discretionary spending like dining out, entertainment, or subscriptions you could cancel." },
  { question: "Where should I keep my emergency fund?", answer: "High-yield savings accounts (HYSAs) are ideal: they're FDIC insured, liquid, and pay 4–5.5% APY (2024). Never invest your emergency fund in stocks — market downturns often coincide with job loss, which is exactly when you'd need the money." },
  { question: "What if I can't save 3–6 months of expenses?", answer: "Start with a $1,000 mini-emergency fund to handle minor emergencies without turning to credit cards. Then systematically build toward your full target. Even a partial emergency fund dramatically reduces financial stress." },
  { question: "Should an emergency fund be in a separate account?", answer: "Yes — keeping it separate from your checking account reduces the temptation to spend it. Set up a dedicated HYSA, name it 'Emergency Fund,' and automate monthly transfers. Separation creates a psychological barrier that helps you preserve the fund." },
];

const RELATED = [
  { href: "/calculators/budget-calculator", label: "Budget Calculator", description: "Find your monthly expense total" },
  { href: "/calculators/savings-goal-calculator", label: "Savings Goal", description: "Plan your savings timeline" },
  { href: "/calculators/net-worth-calculator", label: "Net Worth", description: "Track your full financial picture" },
];

export default function EmergencyFundPage() {
  const [vals, setVals] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (v: string) => setVals((p) => ({ ...p, [k]: v }));

  const calc = useMemo(() => {
    const expenses = parseFloat(vals.monthlyExpenses) || 0;
    const months = parseFloat(vals.monthsCovered) || 6;
    const target = expenses * months;
    const min3 = expenses * 3;
    const mid6 = expenses * 6;
    const max12 = expenses * 12;
    return { target, min3, mid6, max12, months };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Emergency Fund Calculator — How Much Do You Need?"
      description="Calculate your ideal emergency fund size based on your monthly expenses. See what 3, 6, and 12 months of coverage looks like and how long it takes to save."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 space-y-4 h-fit" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Your Profile</h2>
            <button onClick={() => setVals(DEFAULTS)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ color: "#6b7280", background: "rgba(30,58,112,0.3)" }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <InputField id="monthlyExpenses" label="Monthly Essential Expenses" value={vals.monthlyExpenses} onChange={set("monthlyExpenses")} prefix="$" tooltip="Rent, utilities, groceries, insurance, minimum debt payments only" />
          <InputField id="monthsCovered" label="Months to Cover" value={vals.monthsCovered} onChange={set("monthsCovered")} suffix="months" min={1} max={24} tooltip="3 months minimum, 6 recommended, 12 for self-employed" />
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultsCard results={[
            { label: `Emergency Fund Target (${calc.months} months)`, value: fmt(calc.target), highlight: true },
            { label: "Minimum (3 months)", value: fmt(calc.min3) },
            { label: "Recommended (6 months)", value: fmt(calc.mid6) },
            { label: "Self-Employed Goal (12 months)", value: fmt(calc.max12) },
          ]} />
          <div className="ad-slot">Advertisement</div>

          <div className="rounded-2xl p-6 space-y-3" style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(30,58,112,0.3)" }}>
            <h3 className="text-sm font-bold text-white">Coverage Levels</h3>
            {[
              { label: "3 months (minimum)", target: calc.min3, color: "#f87171" },
              { label: "6 months (recommended)", target: calc.mid6, color: "#f59e0b" },
              { label: "12 months (self-employed)", target: calc.max12, color: "#00d084" },
            ].map((tier) => (
              <div key={tier.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "#9ca3af" }}>{tier.label}</span>
                  <span className="font-semibold" style={{ color: tier.color }}>{fmt(tier.target)}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(30,58,112,0.2)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(tier.target / calc.max12) * 100}%`, background: tier.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">How Much Emergency Fund Do You Really Need?</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          An emergency fund is your financial safety net for unexpected events: job loss, medical emergency, major car repair, or home repair. Without one, these events force you into high-interest debt that can take years to escape.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          The standard recommendation is 3–6 months of essential expenses. &quot;Essential&quot; is key — this is rent/mortgage, utilities, groceries, insurance, and minimum debt payments. Discretionary spending (restaurants, streaming, hobbies) can be paused in an emergency. Keep your fund in a high-yield savings account paying 4–5% APY.
        </p>
      </article>
      <FAQSection items={FAQ_ITEMS} pageName="Emergency Fund Calculator" />
    </CalculatorLayout>
  );
}
