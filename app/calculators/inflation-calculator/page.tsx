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

const DEFAULTS = { originalAmount: "100", startYear: "2000", endYear: "2024", inflationRate: "3.1" };

const FAQ_ITEMS = [
  { question: "What is the current US inflation rate?", answer: "As of 2024, US inflation (CPI) has cooled to approximately 3–3.5% after peaking at 9.1% in June 2022. The Federal Reserve targets 2% as its long-run inflation goal. Historical average from 1913–2024 is approximately 3.1% per year." },
  { question: "What does inflation do to purchasing power?", answer: "Inflation erodes purchasing power. $100 in 2000 had the purchasing power of approximately $177 in 2024 (at 3.1% average annual inflation). This means $100 today buys only about 56% of what $100 bought in 2000." },
  { question: "How does the inflation calculator work?", answer: "The formula is: Future Value = Present Value × (1 + inflation rate)^years. For example, $100 growing at 3.1% for 24 years = $100 × (1.031)^24 ≈ $205. This shows what you'd need today to match yesterday's purchasing power." },
  { question: "What sectors have the highest inflation?", answer: "Healthcare and education consistently outpace general CPI inflation. Medical costs have risen 5–7% annually for decades. College tuition has risen 6–8% annually. Food, energy, and housing fluctuate most year to year." },
  { question: "How does inflation affect savings and investments?", answer: "Your real return = nominal return - inflation rate. If your savings account pays 4.5% but inflation is 3.1%, your real return is only 1.4%. This is why investing (historically ~10% nominal return on stocks) is essential to building real wealth." },
];

const RELATED = [
  { href: "/calculators/retirement-calculator", label: "Retirement Calculator", description: "Inflation-adjusted retirement savings" },
  { href: "/calculators/compound-interest-calculator", label: "Compound Interest", description: "Grow money faster than inflation" },
  { href: "/calculators/savings-goal-calculator", label: "Savings Goal", description: "Account for inflation in goals" },
];

export default function InflationCalculatorPage() {
  const [vals, setVals] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (v: string) => setVals((p) => ({ ...p, [k]: v }));

  const calc = useMemo(() => {
    const amount = parseFloat(vals.originalAmount) || 0;
    const start = parseInt(vals.startYear) || 2000;
    const end = parseInt(vals.endYear) || 2024;
    const rate = parseFloat(vals.inflationRate) / 100 || 0;
    const years = end - start;
    if (years <= 0) return null;
    const inflatedValue = amount * Math.pow(1 + rate, years);
    const powerLoss = ((inflatedValue - amount) / inflatedValue) * 100;

    const yearlyLabels: string[] = [];
    const yearlyValues: number[] = [];
    for (let y = 0; y <= years; y++) {
      yearlyLabels.push(`${start + y}`);
      yearlyValues.push(amount * Math.pow(1 + rate, y));
    }

    return { inflatedValue, powerLoss, years, yearlyLabels, yearlyValues };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Inflation Calculator — Purchasing Power Over Time"
      description="Calculate how inflation erodes purchasing power over any time period. See what an amount from the past is worth today, or project future purchasing power."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 space-y-4 h-fit" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Inflation Inputs</h2>
            <button onClick={() => setVals(DEFAULTS)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ color: "#6b7280", background: "rgba(30,58,112,0.3)" }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <InputField id="originalAmount" label="Original Amount" value={vals.originalAmount} onChange={set("originalAmount")} prefix="$" tooltip="The dollar amount you want to adjust for inflation" />
          <InputField id="startYear" label="Start Year" value={vals.startYear} onChange={set("startYear")} min={1913} max={2100} tooltip="The base year for your original amount" />
          <InputField id="endYear" label="End Year" value={vals.endYear} onChange={set("endYear")} min={1914} max={2100} tooltip="The target year to convert to" />
          <InputField id="inflationRate" label="Average Annual Inflation Rate" value={vals.inflationRate} onChange={set("inflationRate")} suffix="%" step={0.1} tooltip="US historical average: ~3.1%. Current CPI: ~3.5%" />
        </div>

        <div className="lg:col-span-3 space-y-5">
          {calc && (
            <>
              <ResultsCard results={[
                { label: `Value in ${vals.endYear}`, value: fmt(calc.inflatedValue), highlight: true },
                { label: "Original Amount", value: fmt(parseFloat(vals.originalAmount) || 0) },
                { label: "Purchasing Power Lost", value: `${calc.powerLoss.toFixed(1)}%` },
                { label: "Years of Inflation", value: `${calc.years} years` },
              ]} />
              <div className="ad-slot">Advertisement</div>
              <FinancialChart type="line" title="Cumulative Inflation Over Time" data={{
                labels: calc.yearlyLabels,
                datasets: [{ label: "Equivalent Value ($)", data: calc.yearlyValues, color: "#fb923c", fill: true }],
              }} />
            </>
          )}
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">Understanding Inflation and Purchasing Power</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          Inflation measures how much the average price level of goods and services rises over time. As prices rise, each dollar buys fewer goods — this is the erosion of purchasing power. The US Consumer Price Index (CPI) measures this change across a basket of common goods.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          The formula is simple: Adjusted Value = Original Amount × (1 + inflation rate)^years. At 3.1% annual inflation, prices double roughly every 23 years (using the Rule of 72: 72 ÷ 3.1 ≈ 23). This is why a salary that felt generous in 2000 may feel modest today.
        </p>
      </article>
      <FAQSection items={FAQ_ITEMS} pageName="Inflation Calculator" />
    </CalculatorLayout>
  );
}
