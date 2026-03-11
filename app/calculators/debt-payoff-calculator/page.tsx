"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { InputField } from "@/components/InputField";
import { ResultsCard } from "@/components/ResultsCard";
import { FinancialChart } from "@/components/FinancialChart";
import { FAQSection } from "@/components/FAQSection";
import { Trash2, Plus } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

interface Debt {
  id: number;
  name: string;
  balance: string;
  rate: string;
  minPayment: string;
}

const FAQ_ITEMS = [
  {
    question: "What is the debt avalanche method?",
    answer: "The debt avalanche method focuses extra payments on your highest-interest debt first while paying minimums on all others. This is mathematically optimal — it minimizes total interest paid and overall payoff time.",
  },
  {
    question: "What is the debt snowball method?",
    answer: "The debt snowball method pays off the smallest balance debt first, regardless of interest rate. While not mathematically optimal, it provides psychological wins that keep many people motivated. Both methods work — the best one is the one you stick to.",
  },
  {
    question: "How much extra should I put toward debt payoff?",
    answer: "Even small amounts matter significantly. An extra $100–$200/month can cut years off your debt and save thousands in interest. Start with whatever you can consistently afford — even $50/month extra makes a real difference.",
  },
  {
    question: "Should I focus on debt payoff or investing?",
    answer: "If your debt interest rate exceeds your expected investment return (typically 6–7%), pay off debt first. High-interest debt (>8%) should almost always be priority. Low-rate debt (<5%) may let you invest simultaneously.",
  },
  {
    question: "What's a debt-free date projection?",
    answer: "This calculator simulates your exact payment schedule month by month, applying minimum payments to all debts and routing extra payment (snowball or avalanche) to your target debt, showing you the precise month you become debt-free.",
  },
];

const RELATED = [
  { href: "/calculators/credit-card-payoff-calculator", label: "Credit Card Payoff", description: "Min vs fixed payment comparison" },
  { href: "/calculators/loan-calculator", label: "Loan Calculator", description: "Full amortization schedule" },
  { href: "/calculators/budget-calculator", label: "Budget Calculator", description: "Find money to put toward debt" },
  { href: "/calculators/net-worth-calculator", label: "Net Worth", description: "Track your total debt vs assets" },
];

export default function DebtPayoffPage() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: "Credit Card", balance: "8000", rate: "20", minPayment: "200" },
    { id: 2, name: "Car Loan", balance: "15000", rate: "7", minPayment: "280" },
    { id: 3, name: "Student Loan", balance: "20000", rate: "5.5", minPayment: "220" },
  ]);
  const [extraPayment, setExtraPayment] = useState("300");
  const [method, setMethod] = useState<"avalanche" | "snowball">("avalanche");
  const nextId = useMemo(() => (debts.length > 0 ? Math.max(...debts.map((d) => d.id)) + 1 : 1), [debts]);

  const addDebt = () =>
    setDebts((p) => [...p, { id: nextId, name: "New Debt", balance: "5000", rate: "10", minPayment: "100" }]);

  const removeDebt = (id: number) => setDebts((p) => p.filter((d) => d.id !== id));

  const updateDebt = (id: number, field: keyof Debt, value: string) =>
    setDebts((p) => p.map((d) => (d.id === id ? { ...d, [field]: value } : d)));

  const calc = useMemo(() => {
    const parsedDebts = debts
      .map((d) => ({
        name: d.name,
        balance: parseFloat(d.balance) || 0,
        rate: parseFloat(d.rate) / 100 / 12,
        minPayment: parseFloat(d.minPayment) || 0,
      }))
      .filter((d) => d.balance > 0);

    if (parsedDebts.length === 0) return null;

    const extra = parseFloat(extraPayment) || 0;
    const totalMinimums = parsedDebts.reduce((s, d) => s + d.minPayment, 0);
    const totalMonthly = totalMinimums + extra;

    // Simulate payoff
    type SimDebt = { name: string; balance: number; rate: number; minPayment: number };
    let balances: SimDebt[] = parsedDebts.map((d) => ({ ...d }));
    let month = 0;
    let totalInterestPaid = 0;
    const monthlyTotals: number[] = [];

    while (balances.some((d) => d.balance > 0) && month < 600) {
      month++;
      let extraLeft = extra;

      // Sort for method
      const sorted = [...balances.filter((d) => d.balance > 0)].sort((a, b) =>
        method === "avalanche" ? b.rate - a.rate : a.balance - b.balance
      );

      // Pay minimums + interest
      balances = balances.map((d) => {
        if (d.balance <= 0) return d;
        const interest = d.balance * d.rate;
        totalInterestPaid += interest;
        const principal = Math.min(d.minPayment - interest, d.balance);
        return { ...d, balance: Math.max(0, d.balance - Math.max(0, principal)) };
      });

      // Apply extra to target debt
      if (sorted.length > 0) {
        const target = sorted[0];
        balances = balances.map((d) => {
          if (d.name !== target.name) return d;
          const pay = Math.min(extraLeft, d.balance);
          extraLeft -= pay;
          return { ...d, balance: Math.max(0, d.balance - pay) };
        });
      }

      monthlyTotals.push(balances.reduce((s, d) => s + d.balance, 0));
    }

    const totalDebt = parsedDebts.reduce((s, d) => s + d.balance, 0);
    const chartLabels = monthlyTotals.length > 0 
      ? monthlyTotals
          .map((_, i) => (i % 6 === 5 || i === monthlyTotals.length - 1 ? `Mo ${i + 1}` : null))
          .filter(Boolean) as string[]
      : ["Mo 0"];
    
    const chartData = monthlyTotals.length > 0
      ? monthlyTotals.filter((_, i) => i % 6 === 5 || i === monthlyTotals.length - 1)
      : [totalDebt];

    return {
      months: month,
      totalInterestPaid,
      totalDebt,
      totalMonthly,
      chartLabels,
      chartData,
    };
  }, [debts, extraPayment, method]);

  return (
    <CalculatorLayout
      title="Debt Payoff Calculator — Avalanche vs Snowball"
      description="Enter all your debts and see which payoff method saves you the most money. Compare the debt avalanche (highest rate first) against the debt snowball (lowest balance first)."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Method Toggle */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
            <h2 className="text-base font-bold text-white mb-3">Payoff Method</h2>
            <div className="grid grid-cols-2 gap-2">
              {(["avalanche", "snowball"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className="py-3 rounded-xl text-sm font-semibold transition-all capitalize"
                  style={{
                    background: method === m ? "rgba(0,208,132,0.15)" : "rgba(30,58,112,0.3)",
                    border: method === m ? "1.5px solid rgba(0,208,132,0.4)" : "1.5px solid rgba(30,58,112,0.3)",
                    color: method === m ? "#00d084" : "#9ca3af",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: "#6b7280" }}>
              {method === "avalanche"
                ? "Highest interest rate first — mathematically optimal, saves most money"
                : "Lowest balance first — builds momentum through quick wins"}
            </p>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
            <InputField id="extra" label="Extra Monthly Payment" value={extraPayment} onChange={setExtraPayment} prefix="$" tooltip="Extra money you can put toward debt each month" />
          </div>

          {/* Debts */}
          <div className="rounded-2xl p-5 space-y-4" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Your Debts</h2>
              <button onClick={addDebt} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,208,132,0.1)", color: "#00d084", border: "1px solid rgba(0,208,132,0.2)" }}>
                <Plus size={12} /> Add Debt
              </button>
            </div>
            {debts.map((d) => (
              <div key={d.id} className="rounded-xl p-4 space-y-2" style={{ background: "rgba(10,22,40,0.5)", border: "1px solid rgba(30,58,112,0.3)" }}>
                <div className="flex items-center justify-between">
                  <input
                    value={d.name}
                    onChange={(e) => updateDebt(d.id, "name", e.target.value)}
                    className="text-sm font-semibold text-white bg-transparent outline-none"
                    aria-label="Debt name"
                  />
                  <button onClick={() => removeDebt(d.id)}><Trash2 size={14} style={{ color: "#f87171" }} /></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { field: "balance" as const, label: "Balance", prefix: "$" },
                    { field: "rate" as const, label: "Rate %", prefix: "" },
                    { field: "minPayment" as const, label: "Min $", prefix: "$" },
                  ].map(({ field, label, prefix }) => (
                    <div key={field}>
                      <label className="text-xs" style={{ color: "#6b7280" }}>{label}</label>
                      <div className="flex items-center rounded-lg mt-1" style={{ background: "rgba(15,32,66,0.6)", border: "1px solid rgba(30,58,112,0.4)" }}>
                        {prefix && <span className="pl-2 text-xs" style={{ color: "#9ca3af" }}>{prefix}</span>}
                        <input
                          type="number"
                          value={d[field]}
                          onChange={(e) => updateDebt(d.id, field, e.target.value)}
                          className="w-full px-2 py-1.5 text-xs text-white bg-transparent outline-none"
                          aria-label={`${d.name} ${label}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-5">
          {calc && (
            <>
              <ResultsCard results={[
                { label: "Debt-Free In", value: `${calc.months} months`, highlight: true, sub: `${(calc.months / 12).toFixed(1)} years` },
                { label: "Total Interest Paid", value: fmt(calc.totalInterestPaid) },
                { label: "Total Monthly Payment", value: fmt(calc.totalMonthly) },
                { label: "Total Debt", value: fmt(calc.totalDebt) },
              ]} />
              <div className="ad-slot">Advertisement</div>
              <FinancialChart type="line" title="Remaining Debt Balance Over Time" data={{
                labels: calc.chartLabels,
                datasets: [{ label: "Total Debt Balance", data: calc.chartData, color: "#f87171", fill: true }],
              }} />
            </>
          )}
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">Debt Avalanche vs Debt Snowball: Which Is Better?</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          The debt avalanche method targets your highest-interest debt first, minimizing total interest paid over the life of your repayment journey. Mathematically, this is the optimal strategy — it gets you debt-free faster and with less money spent on interest.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          The debt snowball, popularized by Dave Ramsey, targets smallest balances first. The quick wins provide psychological momentum. Research shows that people who use snowball often pay off debt successfully even when avalanche would be slightly cheaper — because motivation matters commercially.
        </p>
      </article>

      <FAQSection items={FAQ_ITEMS} pageName="Debt Payoff Calculator" />
    </CalculatorLayout>
  );
}
