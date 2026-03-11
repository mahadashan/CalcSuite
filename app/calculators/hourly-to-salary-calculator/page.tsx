"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { InputField } from "@/components/InputField";
import { ResultsCard } from "@/components/ResultsCard";
import { FAQSection } from "@/components/FAQSection";
import { RotateCcw } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
const fmtFull = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

const DEFAULTS = { hourlyRate: "25", hoursPerWeek: "40", weeksPerYear: "52", stateTaxRate: "5", federalTaxRate: "22" };

const FAQ_ITEMS = [
  { question: "How do you convert hourly to annual salary?", answer: "Annual salary = hourly rate × hours per week × weeks worked per year. For a standard full-time position: $25/hour × 40 hours × 52 weeks = $52,000/year. Part-time or contract workers should adjust hours and weeks accordingly." },
  { question: "What are typical federal income tax rates?", answer: "For 2024, federal marginal tax rates range from 10% to 37%. Most middle-income earners ($44,725–$95,375 for single filers) pay 22% on income in that bracket. Your effective tax rate (total taxes ÷ gross income) is usually lower than your marginal rate." },
  { question: "How much is $20 an hour annually?", answer: "$20/hour × 40 hours × 52 weeks = $41,600/year before taxes. After typical federal and state taxes (roughly 20–25% combined), take-home pay is approximately $31,000–$33,000/year or $2,580–$2,750/month." },
  { question: "Does this include benefits value?", answer: "This calculator shows gross and net income only. Full-time employees should add the value of employer benefits: health insurance ($6,000–$20,000/year), 401k match (3–6% of salary), paid vacation (2–4 weeks), etc. These can add 30–40% to your total compensation." },
  { question: "How is this helpful for freelancers or contractors?", answer: "Freelancers pay both employer and employee Social Security/Medicare (15.3% self-employment tax) plus estimated quarterly income taxes. This calculator helps you understand what hourly rate you need to charge to match a target full-time salary including these extra costs." },
];

const RELATED = [
  { href: "/calculators/budget-calculator", label: "Budget Calculator", description: "Plan spending around your income" },
  { href: "/calculators/emergency-fund-calculator", label: "Emergency Fund", description: "How much buffer you need" },
  { href: "/calculators/retirement-calculator", label: "Retirement Calculator", description: "Plan retirement from income" },
];

export default function HourlyToSalaryPage() {
  const [vals, setVals] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (v: string) => setVals((p) => ({ ...p, [k]: v }));

  const calc = useMemo(() => {
    const rate = parseFloat(vals.hourlyRate) || 0;
    const hours = parseFloat(vals.hoursPerWeek) || 40;
    const weeks = parseFloat(vals.weeksPerYear) || 52;
    const state = parseFloat(vals.stateTaxRate) / 100 || 0;
    const federal = parseFloat(vals.federalTaxRate) / 100 || 0;
    const fica = 0.0765; // 7.65% employee portion

    const annual = rate * hours * weeks;
    const monthly = annual / 12;
    const weekly = annual / weeks;
    const totalTaxRate = federal + state + fica;
    const annualTaxes = annual * totalTaxRate;
    const takeHome = annual - annualTaxes;
    const monthlyTakeHome = takeHome / 12;

    return { annual, monthly, weekly, annualTaxes, takeHome, monthlyTakeHome, totalTaxRate: totalTaxRate * 100 };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Hourly Wage to Annual Salary Calculator"
      description="Convert any hourly rate to an annual salary with tax estimates. See your monthly and weekly take-home pay after federal, state, and FICA taxes."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 space-y-4 h-fit" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Your Work Details</h2>
            <button onClick={() => setVals(DEFAULTS)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ color: "#6b7280", background: "rgba(30,58,112,0.3)" }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <InputField id="hourlyRate" label="Hourly Rate" value={vals.hourlyRate} onChange={set("hourlyRate")} prefix="$/hr" tooltip="Your gross hourly rate before taxes" />
          <InputField id="hoursPerWeek" label="Hours Per Week" value={vals.hoursPerWeek} onChange={set("hoursPerWeek")} suffix="hrs" min={1} max={80} />
          <InputField id="weeksPerYear" label="Weeks Worked Per Year" value={vals.weeksPerYear} onChange={set("weeksPerYear")} suffix="wks" min={1} max={52} tooltip="Typical: 50 weeks (2 weeks vacation)" />
          <InputField id="federalTaxRate" label="Federal Tax Rate (marginal)" value={vals.federalTaxRate} onChange={set("federalTaxRate")} suffix="%" step={1} tooltip="Your marginal federal bracket. Common: 22% for $44K–$95K income" />
          <InputField id="stateTaxRate" label="State Tax Rate" value={vals.stateTaxRate} onChange={set("stateTaxRate")} suffix="%" step={0.5} tooltip="0% in TX, FL, WA. Up to 13.3% in CA" />
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultsCard results={[
            { label: "Annual Gross Salary", value: fmt(calc.annual), highlight: true },
            { label: "Monthly Gross", value: fmt(calc.monthly) },
            { label: "Annual Take-Home", value: fmt(calc.takeHome), sub: `After ~${calc.totalTaxRate.toFixed(0)}% total taxes` },
            { label: "Monthly Take-Home", value: fmtFull(calc.monthlyTakeHome) },
            { label: "Weekly Pay", value: fmtFull(calc.weekly / (1 + calc.totalTaxRate / 100)), sub: "approximate net" },
            { label: "Annual Taxes Paid", value: fmt(calc.annualTaxes) },
          ]} />
          <div className="ad-slot">Advertisement</div>
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">Converting Hourly Wage to Annual Salary</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          The formula to convert hourly pay to annual salary is simple: Annual = Hourly Rate × Hours per Week × Weeks per Year. For a standard 40-hour work week with 50 working weeks (2 weeks off), that&apos;s rate × 40 × 50 = rate × 2,000. A $25/hour rate becomes $50,000/year gross.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          This calculator also factors in FICA taxes (Social Security 6.2% + Medicare 1.45% = 7.65%), federal income tax, and state income tax to show your true take-home pay. Note: these are estimates — your actual taxes depend on deductions, credits, and filing status.
        </p>
      </article>
      <FAQSection items={FAQ_ITEMS} pageName="Hourly to Salary Calculator" />
    </CalculatorLayout>
  );
}
