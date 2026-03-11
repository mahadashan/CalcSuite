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

const DEFAULTS = { currentAge: "30", retirementAge: "65", currentSavings: "50000", monthlyContrib: "500", annualReturn: "7", inflation: "3" };

const FAQ_ITEMS = [
  { question: "How much should I have saved for retirement?", answer: "A popular rule of thumb: 10x your final salary by retirement. By age 30, aim for 1x your salary; by 40, 3x; by 50, 6x; by 60, 8x. These are guidelines — your actual target depends on your expected retirement spending and Social Security benefits." },
  { question: "What is the 4% withdrawal rule?", answer: "The 4% rule suggests you can withdraw 4% of your portfolio in year one of retirement, then adjust for inflation annually, and have a high probability of your money lasting 30+ years. At 4%, you need 25x your annual expenses saved." },
  { question: "Does this calculator account for inflation?", answer: "Yes. The inflation adjustment shows you both the nominal future value and the real purchasing-power-adjusted value of your retirement savings, helping you make more realistic projections." },
  { question: "What return rate should I use?", answer: "Conservative: 5–6% (bonds/balanced). Moderate: 7–8% (diversified stocks/bonds). Aggressive: 9–10% (mostly stocks). These are pre-inflation returns. A 7% nominal return with 3% inflation equals roughly 4% real return." },
  { question: "When should I start saving for retirement?", answer: "The earlier the better — dramatically. Someone who saves $300/month from age 22–32 (10 years) and stops often ends up with more retirement savings than someone who saves $300/month from age 32–65 (33 years), purely due to compounding." },
];

const RELATED = [
  { href: "/calculators/compound-interest-calculator", label: "Compound Interest", description: "Long-term investment growth" },
  { href: "/calculators/savings-goal-calculator", label: "Savings Goal", description: "Hit any financial target" },
  { href: "/calculators/roi-calculator", label: "ROI Calculator", description: "Analyze investment returns" },
  { href: "/calculators/budget-calculator", label: "Budget Calculator", description: "Find money to save monthly" },
];

export default function RetirementCalculatorPage() {
  const [vals, setVals] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (v: string) => setVals((p) => ({ ...p, [k]: v }));
  const reset = () => setVals(DEFAULTS);

  const calc = useMemo(() => {
    const curAge = parseFloat(vals.currentAge) || 30;
    const retAge = parseFloat(vals.retirementAge) || 65;
    const years = Math.max(0, retAge - curAge);
    const P = parseFloat(vals.currentSavings) || 0;
    const pmt = parseFloat(vals.monthlyContrib) || 0;
    const r = parseFloat(vals.annualReturn) / 100 || 0;
    const inf = parseFloat(vals.inflation) / 100 || 0;

    const mr = r / 12;
    const n = years * 12;
    const principalFV = P * Math.pow(1 + mr, n);
    const contributionFV = mr > 0 ? pmt * ((Math.pow(1 + mr, n) - 1) / mr) : pmt * n;
    const totalNominal = principalFV + contributionFV;
    const realFV = totalNominal / Math.pow(1 + inf, years);
    const withdrawalAt4Pct = realFV * 0.04 / 12;

    const yearlyLabels: string[] = [];
    const yearlyNominal: number[] = [];
    const yearlyReal: number[] = [];
    for (let y = 1; y <= years; y++) {
      const pFV = P * Math.pow(1 + mr, y * 12);
      const cFV = mr > 0 ? pmt * ((Math.pow(1 + mr, y * 12) - 1) / mr) : pmt * y * 12;
      const nom = pFV + cFV;
      yearlyLabels.push(`Age ${curAge + y}`);
      yearlyNominal.push(nom);
      yearlyReal.push(nom / Math.pow(1 + inf, y));
    }

    return { totalNominal, realFV, withdrawalAt4Pct, years, yearlyLabels, yearlyNominal, yearlyReal };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Retirement Savings Calculator with Inflation Adjustment"
      description="Project your retirement nest egg with inflation-adjusted values. Enter your current savings, monthly contributions, and expected return to see your real purchasing power at retirement."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 space-y-4 h-fit" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Your Details</h2>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ color: "#6b7280", background: "rgba(30,58,112,0.3)" }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <InputField id="currentAge" label="Current Age" value={vals.currentAge} onChange={set("currentAge")} suffix="yrs" min={18} max={80} />
          <InputField id="retirementAge" label="Retirement Age" value={vals.retirementAge} onChange={set("retirementAge")} suffix="yrs" min={40} max={80} />
          <InputField id="currentSavings" label="Current Savings" value={vals.currentSavings} onChange={set("currentSavings")} prefix="$" tooltip="Total amount already saved for retirement" />
          <InputField id="monthlyContrib" label="Monthly Contribution" value={vals.monthlyContrib} onChange={set("monthlyContrib")} prefix="$" tooltip="How much you save per month" />
          <InputField id="annualReturn" label="Expected Annual Return" value={vals.annualReturn} onChange={set("annualReturn")} suffix="%" step={0.5} tooltip="S&P 500 historical average: ~10% nominal, ~7% real" />
          <InputField id="inflation" label="Inflation Rate" value={vals.inflation} onChange={set("inflation")} suffix="%" step={0.5} tooltip="Historical US inflation average: ~3%" />
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultsCard results={[
            { label: "Nominal Retirement Balance", value: fmt(calc.totalNominal), highlight: true },
            { label: "Inflation-Adjusted Value", value: fmt(calc.realFV), sub: `In today's dollars` },
            { label: "Monthly Income (4% rule)", value: fmt(calc.withdrawalAt4Pct), sub: "Sustainable monthly withdrawal" },
            { label: "Years to Retirement", value: `${calc.years} years` },
          ]} />
          <div className="ad-slot">Advertisement</div>
          <FinancialChart type="line" title="Retirement Portfolio Growth" data={{
            labels: calc.yearlyLabels,
            datasets: [
              { label: "Nominal Value", data: calc.yearlyNominal, color: "#00d084", fill: true },
              { label: "Real Value (Inflation-Adj)", data: calc.yearlyReal, color: "#f59e0b", fill: false },
            ],
          }} />
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">Retirement Planning with Inflation</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          This calculator projects your retirement nest egg using compound growth on both your existing savings and ongoing monthly contributions. The inflation adjustment is critical — $1 million in 35 years has the purchasing power of roughly $355,000 today at 3% annual inflation.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          The 4% rule provides a monthly withdrawal estimate based on research showing this sustainable withdrawal rate allows a 30-year retirement with high success probability. For a longer retirement (40+ years), consider using 3.5% to be safer.
        </p>
      </article>
      <FAQSection items={FAQ_ITEMS} pageName="Retirement Savings Calculator" />
    </CalculatorLayout>
  );
}
