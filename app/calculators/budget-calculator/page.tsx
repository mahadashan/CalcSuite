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

const DEFAULTS = { income: "5000", housing: "30", food: "15", transport: "10", utilities: "5", entertainment: "5", savings: "20", other: "15" };

const FAQ_ITEMS = [
  { question: "What is the 50/30/20 budget rule?", answer: "The 50/30/20 rule allocates 50% of after-tax income to needs (housing, food, utilities), 30% to wants (entertainment, dining out, hobbies), and 20% to savings and debt repayment. It's a simple, flexible framework for any income level." },
  { question: "How do I calculate my after-tax income?", answer: "Take your gross pay and subtract federal income tax, state income tax, Social Security (6.2%), and Medicare (1.45%). As a rough estimate, someone earning $60,000/year keeps about $48,000–$50,000 after taxes depending on their state." },
  { question: "Is $1,500/month rent too much?", answer: "The traditional guideline is housing (rent/mortgage + utilities) should not exceed 28–30% of gross income. If you earn $60,000/year ($5,000/month gross), $1,500 rent is exactly 30% of gross income — which is within the generally accepted range." },
  { question: "How much should I save each month?", answer: "The 50/30/20 rule suggests 20% of take-home pay. If that's not achievable, start with what you can and increase by 1% every 3 months. Even 5–10% savings is far better than nothing and builds the habit." },
  { question: "What are the most important budget categories?", answer: "Non-negotiables: housing, food, utilities, transportation, insurance, minimum debt payments. Discretionary: entertainment, dining, subscriptions, clothing. Track all categories for 30 days to understand your actual spending patterns." },
];

const RELATED = [
  { href: "/calculators/savings-goal-calculator", label: "Savings Goal", description: "How long to reach your savings target" },
  { href: "/calculators/emergency-fund-calculator", label: "Emergency Fund", description: "How much buffer you need" },
  { href: "/calculators/debt-payoff-calculator", label: "Debt Payoff", description: "Free up budget by eliminating debt" },
  { href: "/calculators/net-worth-calculator", label: "Net Worth", description: "Track assets and liabilities" },
];

export default function BudgetCalculatorPage() {
  const [vals, setVals] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (v: string) => setVals((p) => ({ ...p, [k]: v }));
  const reset = () => setVals(DEFAULTS);

  const calc = useMemo(() => {
    const income = parseFloat(vals.income) || 0;
    const cats = [
      { name: "Housing", pct: parseFloat(vals.housing) || 0, color: "#3b82f6" },
      { name: "Food", pct: parseFloat(vals.food) || 0, color: "#00d084" },
      { name: "Transport", pct: parseFloat(vals.transport) || 0, color: "#f59e0b" },
      { name: "Utilities", pct: parseFloat(vals.utilities) || 0, color: "#8b5cf6" },
      { name: "Entertainment", pct: parseFloat(vals.entertainment) || 0, color: "#f87171" },
      { name: "Savings", pct: parseFloat(vals.savings) || 0, color: "#10b981" },
      { name: "Other", pct: parseFloat(vals.other) || 0, color: "#6b7280" },
    ];
    const totalPct = cats.reduce((s, c) => s + c.pct, 0);
    const remaining = 100 - totalPct;

    return { income, cats, totalPct, remaining, monthlyRemaining: income * remaining / 100 };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Budget Calculator — 50/30/20 Rule & Custom Allocation"
      description="Build your monthly budget using the 50/30/20 rule or customize your own category allocations. See instantly how much goes to each spending area and what's left over."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 space-y-4 h-fit" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Your Budget</h2>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ color: "#6b7280", background: "rgba(30,58,112,0.3)" }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <InputField id="income" label="Monthly Take-Home Income" value={vals.income} onChange={set("income")} prefix="$" tooltip="Your income after taxes" />
          <div className="border-t pt-4" style={{ borderColor: "rgba(30,58,112,0.3)" }}>
            <p className="text-xs font-medium mb-3" style={{ color: "#9ca3af" }}>Category Allocations (% of income)</p>
            {[
              { key: "housing" as const, label: "Housing & Utilities" },
              { key: "food" as const, label: "Food & Groceries" },
              { key: "transport" as const, label: "Transport" },
              { key: "utilities" as const, label: "Bills & Subscriptions" },
              { key: "entertainment" as const, label: "Entertainment" },
              { key: "savings" as const, label: "Savings & Investments" },
              { key: "other" as const, label: "Other / Misc" },
            ].map((c) => (
              <InputField key={c.key} id={c.key} label={c.label} value={vals[c.key]} onChange={set(c.key)} suffix="%" step={1} min={0} max={100} />
            ))}
          </div>
          <div className={`text-xs font-semibold text-center py-2 rounded-lg`} style={{
            background: Math.abs(calc.remaining) < 1 ? "rgba(0,208,132,0.1)" : calc.remaining < 0 ? "rgba(248,113,113,0.1)" : "rgba(245,158,11,0.1)",
            color: Math.abs(calc.remaining) < 1 ? "#00d084" : calc.remaining < 0 ? "#f87171" : "#f59e0b",
            border: `1px solid ${Math.abs(calc.remaining) < 1 ? "rgba(0,208,132,0.3)" : calc.remaining < 0 ? "rgba(248,113,113,0.3)" : "rgba(245,158,11,0.3)"}`,
          }}>
            {calc.remaining >= 0 ? `${calc.remaining.toFixed(0)}% unallocated (${fmt(calc.monthlyRemaining)}/mo)` : `Over-allocated by ${Math.abs(calc.remaining).toFixed(0)}%`}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultsCard results={[
            { label: "Monthly Income", value: fmt(calc.income), highlight: true },
            { label: "Total Allocated", value: `${calc.totalPct.toFixed(0)}%` },
            { label: "Unallocated", value: fmt(calc.monthlyRemaining), sub: `${calc.remaining.toFixed(0)}% of income` },
          ]} />
          <div className="ad-slot">Advertisement</div>

          {/* Category breakdown */}
          <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(30,58,112,0.3)" }}>
            <h3 className="text-sm font-bold text-white mb-2">Monthly Breakdown</h3>
            {calc.cats.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: "#d1d5db" }}>{c.name}</span>
                  <span className="font-semibold" style={{ color: c.color }}>{fmt(calc.income * c.pct / 100)} ({c.pct}%)</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(30,58,112,0.2)" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(c.pct, 100)}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>

          <FinancialChart type="bar" title="Budget Allocation by Category" data={{
            labels: calc.cats.map((c) => c.name),
            datasets: [{ label: "Monthly Amount ($)", data: calc.cats.map((c) => calc.income * c.pct / 100), color: "#00d084" }],
          }} />
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">The 50/30/20 Budget Rule Explained</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          The 50/30/20 rule, popularized by Senator Elizabeth Warren, divides your after-tax income into three buckets: 50% for needs (rent, groceries, utilities, insurance), 30% for wants (dining out, streaming, hobbies), and 20% for savings and debt repayment above minimums.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          This calculator lets you customize every category percentage and instantly see the dollar amounts. If you can&apos;t hit 20% savings, that&apos;s okay — even 5–10% is a strong foundation. The goal is awareness and intentionality, not perfection.
        </p>
      </article>

      <FAQSection items={FAQ_ITEMS} pageName="Budget Calculator" />
    </CalculatorLayout>
  );
}
