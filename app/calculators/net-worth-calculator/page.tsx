"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { ResultsCard } from "@/components/ResultsCard";
import { FAQSection } from "@/components/FAQSection";
import { Plus, Trash2 } from "lucide-react";

let idCounter = 0;
const newId = () => ++idCounter;

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.abs(v));

interface LineItem { id: number; name: string; value: string; }

const FAQ_ITEMS = [
  { question: "What is net worth?", answer: "Net worth is the total value of everything you own (assets) minus everything you owe (liabilities). It's the most comprehensive single-number snapshot of your financial health. Positive net worth means assets exceed debts; negative net worth means you owe more than you own." },
  { question: "What is a good net worth by age?", answer: "A common benchmark: net worth should equal your age × your annual salary ÷ 10. At 30, earning $70,000/year: target $210,000. At 40: $280,000. These are guidelines, not rules. Median US net worth by age: 30s: ~$76,000; 40s: ~$290,000; 50s: ~$590,000." },
  { question: "What counts as an asset?", answer: "Assets include: cash and savings accounts, checking accounts, retirement accounts (401k, IRA), brokerage accounts, real estate equity, business ownership value, vehicles (current market value), jewelry, and other valuables." },
  { question: "What counts as a liability?", answer: "Liabilities include: mortgage balance, home equity lines of credit, car loans, student loans, credit card debt, personal loans, medical debt, and any other money you owe to creditors." },
  { question: "How often should I calculate my net worth?", answer: "Monthly tracking gives you the best visibility into your financial progress, but quarterly is sufficient for most people. Use a spreadsheet or this calculator to track changes over time — watching net worth grow month by month is a powerful motivator." },
];

const RELATED = [
  { href: "/calculators/budget-calculator", label: "Budget Calculator", description: "Plan your monthly spending" },
  { href: "/calculators/debt-payoff-calculator", label: "Debt Payoff", description: "Reduce your liabilities" },
  { href: "/calculators/retirement-calculator", label: "Retirement Calculator", description: "Build long-term assets" },
];

const initAssets: LineItem[] = [
  { id: newId(), name: "Checking/Savings", value: "15000" },
  { id: newId(), name: "Retirement Accounts", value: "80000" },
  { id: newId(), name: "Home Equity", value: "120000" },
  { id: newId(), name: "Vehicle (market value)", value: "20000" },
];

const initLiabilities: LineItem[] = [
  { id: newId(), name: "Mortgage Balance", value: "200000" },
  { id: newId(), name: "Car Loan", value: "12000" },
  { id: newId(), name: "Credit Card Debt", value: "5000" },
];

const addItem = (setter: React.Dispatch<React.SetStateAction<LineItem[]>>) =>
  setter((p) => [...p, { id: newId(), name: "New Item", value: "0" }]);

const removeItem = (setter: React.Dispatch<React.SetStateAction<LineItem[]>>, id: number) =>
  setter((p) => p.filter((i) => i.id !== id));

const updateItem = (setter: React.Dispatch<React.SetStateAction<LineItem[]>>, id: number, field: keyof LineItem, val: string) =>
  setter((p) => p.map((i) => (i.id === id ? { ...i, [field]: val } : i)));

const ItemList = ({ items, setter, label }: { items: LineItem[]; setter: React.Dispatch<React.SetStateAction<LineItem[]>>; label: string }) => (
  <div className="rounded-2xl p-5" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-base font-bold text-white">{label}</h3>
      <button onClick={() => addItem(setter)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,208,132,0.1)", color: "#00d084", border: "1px solid rgba(0,208,132,0.2)" }}>
        <Plus size={12} /> Add
      </button>
    </div>
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <input value={item.name} onChange={(e) => updateItem(setter, item.id, "name", e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-lg text-white bg-transparent outline-none" style={{ border: "1px solid rgba(30,58,112,0.4)", background: "rgba(10,22,40,0.5)" }}
            aria-label="Item name" />
          <div className="flex items-center rounded-lg" style={{ border: "1px solid rgba(30,58,112,0.4)", background: "rgba(10,22,40,0.5)" }}>
            <span className="px-2 text-xs" style={{ color: "#9ca3af" }}>$</span>
            <input type="number" value={item.value} onChange={(e) => updateItem(setter, item.id, "value", e.target.value)}
              className="w-24 pr-2 py-2 text-xs text-white bg-transparent outline-none" aria-label="Item value" />
          </div>
          <button onClick={() => removeItem(setter, item.id)}><Trash2 size={14} style={{ color: "#f87171" }} /></button>
        </div>
      ))}
    </div>
  </div>
);

export default function NetWorthCalculatorPage() {
  const [assets, setAssets] = useState<LineItem[]>(initAssets);
  const [liabilities, setLiabilities] = useState<LineItem[]>(initLiabilities);

  const calc = useMemo(() => {
    const totalAssets = assets.reduce((s, i) => s + (parseFloat(i.value) || 0), 0);
    const totalLiabilities = liabilities.reduce((s, i) => s + (parseFloat(i.value) || 0), 0);
    const netWorth = totalAssets - totalLiabilities;
    return { totalAssets, totalLiabilities, netWorth };
  }, [assets, liabilities]);

  return (
    <CalculatorLayout
      title="Net Worth Calculator — Assets Minus Liabilities"
      description="Calculate your net worth by entering your assets and liabilities. Get a complete breakdown of where you stand financially and track your wealth over time."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <ItemList items={assets} setter={setAssets} label="Assets (What You Own)" />
          <ItemList items={liabilities} setter={setLiabilities} label="Liabilities (What You Owe)" />
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultsCard results={[
            { label: "Net Worth", value: (calc.netWorth >= 0 ? "+" : "-") + fmt(calc.netWorth), highlight: true, sub: calc.netWorth >= 0 ? "Assets exceed liabilities" : "Liabilities exceed assets" },
            { label: "Total Assets", value: fmt(calc.totalAssets) },
            { label: "Total Liabilities", value: fmt(calc.totalLiabilities) },
          ]} />
          <div className="ad-slot">Advertisement</div>
          <div className="rounded-2xl p-6" style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(30,58,112,0.3)" }}>
            <h3 className="text-sm font-bold text-white mb-4">Balance Sheet Summary</h3>
            <div className="space-y-2">
              <div className="h-8 rounded-lg overflow-hidden flex">
                <div className="flex items-center justify-center text-xs font-semibold text-white transition-all" style={{ width: `${(calc.totalAssets / (calc.totalAssets + calc.totalLiabilities || 1)) * 100}%`, background: "#00d084", minWidth: 40 }}>
                  Assets
                </div>
                <div className="flex items-center justify-center text-xs font-semibold text-white transition-all" style={{ flex: 1, background: "#f87171" }}>
                  Liabilities
                </div>
              </div>
              <div className="flex justify-between text-xs" style={{ color: "#9ca3af" }}>
                <span style={{ color: "#00d084" }}>{fmt(calc.totalAssets)} assets</span>
                <span style={{ color: "#f87171" }}>{fmt(calc.totalLiabilities)} liabilities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">How to Calculate Your Net Worth</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          Net worth is the single most important number in personal finance. The formula is simple: Net Worth = Total Assets - Total Liabilities. Assets are everything you own that has monetary value; liabilities are all debts you owe.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          Most financial advisors recommend tracking net worth monthly. Even if your net worth is negative (common in your 20s with student loans), watching the trend move upward is a powerful motivator. A positive trend matters more than the absolute number.
        </p>
      </article>
      <FAQSection items={FAQ_ITEMS} pageName="Net Worth Calculator" />
    </CalculatorLayout>
  );
}
