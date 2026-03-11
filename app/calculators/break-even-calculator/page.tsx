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

const DEFAULTS = { fixedCosts: "5000", variableCost: "20", sellingPrice: "50", expectedUnits: "500" };

const FAQ_ITEMS = [
  { question: "What is break-even analysis?", answer: "Break-even analysis determines the point where your total revenue equals total costs (fixed + variable), resulting in zero profit or loss. Selling above the break-even quantity generates profit; below it generates a loss." },
  { question: "How do you calculate the break-even point?", answer: "Break-Even Units = Fixed Costs ÷ (Selling Price - Variable Cost per Unit). The denominator (price minus variable cost) is called the contribution margin per unit — how much each sale contributes toward covering fixed costs." },
  { question: "What are fixed vs variable costs?", answer: "Fixed costs stay constant regardless of production volume: rent, salaries, insurance, equipment leases, and software subscriptions. Variable costs scale with production: materials, packaging, shipping, and sales commissions." },
  { question: "What is a good profit margin?", answer: "Net profit margins vary widely by industry. Software/SaaS: 20–40%+. Retail: 2–5%. Restaurants: 3–6%. Service businesses: 10–20%. E-commerce: 5–15%. A positive margin means profit; focus on contribution margin to optimize pricing." },
  { question: "How long does it take for a small business to break even?", answer: "Most small businesses take 2–3 years to break even overall, though individual products can break even within months if priced correctly. The key lever is increasing your selling price or reducing variable costs to widen the contribution margin." },
];

const RELATED = [
  { href: "/calculators/roi-calculator", label: "ROI Calculator", description: "Calculate investment returns" },
  { href: "/calculators/budget-calculator", label: "Budget Calculator", description: "Plan business finances" },
  { href: "/calculators/savings-goal-calculator", label: "Savings Goal", description: "Save for business investment" },
];

export default function BreakEvenPage() {
  const [vals, setVals] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (v: string) => setVals((p) => ({ ...p, [k]: v }));

  const calc = useMemo(() => {
    const fixedCosts = parseFloat(vals.fixedCosts) || 0;
    const variableCost = parseFloat(vals.variableCost) || 0;
    const sellingPrice = parseFloat(vals.sellingPrice) || 1;
    const expectedUnits = parseFloat(vals.expectedUnits) || 0;

    const contributionMargin = sellingPrice - variableCost;
    const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
    const breakEvenRevenue = breakEvenUnits * sellingPrice;
    const expectedRevenue = expectedUnits * sellingPrice;
    const expectedProfit = expectedRevenue - fixedCosts - expectedUnits * variableCost;
    const marginOfSafety = breakEvenUnits > 0 ? ((expectedUnits - breakEvenUnits) / expectedUnits) * 100 : 0;

    // Chart data
    const maxUnits = Math.ceil(Math.max(breakEvenUnits * 2, expectedUnits * 1.2, 100));
    const step = Math.ceil(maxUnits / 20);
    const units: number[] = [];
    const revenues: number[] = [];
    const totalCosts: number[] = [];

    for (let u = 0; u <= maxUnits; u += step) {
      units.push(u);
      revenues.push(u * sellingPrice);
      totalCosts.push(fixedCosts + u * variableCost);
    }

    return { contributionMargin, breakEvenUnits, breakEvenRevenue, expectedRevenue, expectedProfit, marginOfSafety, units: units.map(String), revenues, totalCosts };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Break-Even Calculator — When Does Your Business Turn Profitable?"
      description="Calculate how many units you need to sell to cover all costs. See your contribution margin, break-even revenue, and profit at any sales volume."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 space-y-4 h-fit" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Business Inputs</h2>
            <button onClick={() => setVals(DEFAULTS)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ color: "#6b7280", background: "rgba(30,58,112,0.3)" }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <InputField id="fixedCosts" label="Monthly Fixed Costs" value={vals.fixedCosts} onChange={set("fixedCosts")} prefix="$" tooltip="Rent, salaries, software, insurance — costs that don't change with sales" />
          <InputField id="variableCost" label="Variable Cost Per Unit" value={vals.variableCost} onChange={set("variableCost")} prefix="$" tooltip="Materials, packaging, shipping per unit sold" />
          <InputField id="sellingPrice" label="Selling Price Per Unit" value={vals.sellingPrice} onChange={set("sellingPrice")} prefix="$" tooltip="Your price to the customer per unit" />
          <InputField id="expectedUnits" label="Expected Monthly Units Sold" value={vals.expectedUnits} onChange={set("expectedUnits")} suffix="units" tooltip="Your sales volume forecast" />
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultsCard results={[
            { label: "Break-Even Units", value: `${calc.breakEvenUnits.toFixed(0)} units`, highlight: true },
            { label: "Break-Even Revenue", value: fmt(calc.breakEvenRevenue) },
            { label: "Contribution Margin", value: fmt(calc.contributionMargin) + "/unit", sub: `${((calc.contributionMargin / parseFloat(vals.sellingPrice || "1")) * 100).toFixed(1)}% margin` },
            { label: "Expected Profit/Loss", value: fmt(Math.abs(calc.expectedProfit)), sub: calc.expectedProfit >= 0 ? "Profit ✓" : "Loss — below break-even" },
            { label: "Margin of Safety", value: `${calc.marginOfSafety.toFixed(1)}%`, sub: "Sales cushion above break-even" },
          ]} />
          <div className="ad-slot">Advertisement</div>
          <FinancialChart type="line" title="Revenue vs Total Costs by Units Sold" data={{
            labels: calc.units,
            datasets: [
              { label: "Revenue", data: calc.revenues, color: "#00d084", fill: false },
              { label: "Total Costs", data: calc.totalCosts, color: "#f87171", fill: false },
            ],
          }} />
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">Break-Even Analysis for Small Business</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          Break-even analysis is foundational to any business plan. The formula: Break-Even Point = Fixed Costs ÷ Contribution Margin per Unit. The contribution margin is your selling price minus variable cost per unit — the amount each sale contributes toward paying fixed costs and eventually generating profit.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          The chart shows where the revenue line crosses the total cost line — that intersection is your break-even point. Every unit sold above that point generates pure profit equal to the contribution margin. To lower your break-even, either reduce fixed costs, reduce variable costs, or increase your selling price.
        </p>
      </article>
      <FAQSection items={FAQ_ITEMS} pageName="Break-Even Calculator" />
    </CalculatorLayout>
  );
}
