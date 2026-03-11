"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { InputField } from "@/components/InputField";
import { ResultsCard } from "@/components/ResultsCard";
import { FinancialChart } from "@/components/FinancialChart";
import { AmortizationTable, AmortRow } from "@/components/AmortizationTable";
import { FAQSection } from "@/components/FAQSection";
import { RotateCcw } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
const fmtFull = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

const DEFAULTS = { loanAmount: "25000", interestRate: "8", loanTerm: "5" };

const FAQ_ITEMS = [
  {
    question: "How is my loan payment calculated?",
    answer: "Your monthly loan payment uses the amortization formula: M = P[r(1+r)^n]/[(1+r)^n-1], where P is the principal, r is the monthly rate, and n is total payments. This ensures equal monthly payments while interest decreases each month.",
  },
  {
    question: "What's the difference between a personal loan and auto loan?",
    answer: "Personal loans are unsecured (no collateral) and typically have higher rates (8–36%). Auto loans are secured by the vehicle, so rates are lower (4–12%). This calculator works for both — just enter your actual rate.",
  },
  {
    question: "Should I choose a shorter or longer loan term?",
    answer: "Shorter terms mean higher monthly payments but dramatically less total interest paid. Longer terms lower your monthly burden but cost more long-term. Use this calculator to compare both scenarios.",
  },
  {
    question: "Can I pay off my loan early?",
    answer: "Most personal and auto loans allow early payoff without penalties, though you should check your loan agreement. Paying extra each month reduces principal faster and saves interest. Look at the mortgage calculator for extra payment modeling.",
  },
  {
    question: "What APR should I expect?",
    answer: "APR depends heavily on your credit score. Excellent credit (750+): 6–12%. Good credit (700–749): 10–18%. Fair credit (640–699): 18–28%. Poor credit: 28–36%+. Always shop multiple lenders to compare offers.",
  },
];

const RELATED = [
  { href: "/calculators/mortgage-calculator", label: "Mortgage Calculator", description: "Home loan with extra payments" },
  { href: "/calculators/credit-card-payoff-calculator", label: "Credit Card Payoff", description: "Pay down high-interest debt" },
  { href: "/calculators/debt-payoff-calculator", label: "Debt Payoff", description: "Avalanche vs snowball method" },
  { href: "/calculators/budget-calculator", label: "Budget Calculator", description: "Plan your monthly payments" },
];

export default function LoanCalculatorPage() {
  const [vals, setVals] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (v: string) => setVals((p) => ({ ...p, [k]: v }));
  const reset = () => setVals(DEFAULTS);

  const calc = useMemo(() => {
    const P = parseFloat(vals.loanAmount) || 0;
    const annualRate = parseFloat(vals.interestRate) || 0;
    const r = annualRate / 100 / 12;
    const n = (parseFloat(vals.loanTerm) || 5) * 12;

    let monthlyPayment = 0;
    if (P > 0 && r > 0) {
      monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (r === 0) {
      monthlyPayment = P / n;
    }

    const rows: AmortRow[] = [];
    let balance = P;
    let totalInterest = 0;

    for (let month = 1; month <= n && balance > 0; month++) {
      const interestPaid = balance * r;
      let principalPaid = monthlyPayment - interestPaid;
      if (principalPaid > balance) principalPaid = balance;
      balance = Math.max(0, balance - principalPaid);
      totalInterest += interestPaid;
      rows.push({ month, payment: monthlyPayment, principal: principalPaid, interest: interestPaid, balance });
    }

    const actualTermMonths = rows.length;

    const yearlyLabels: string[] = [];
    const yearlyBalance: number[] = [];
    const yearlyInterest: number[] = [];
    for (let y = 1; y <= Math.ceil(actualTermMonths / 12); y++) {
      yearlyLabels.push(`Yr ${y}`);
      const row = rows[Math.min(y * 12 - 1, rows.length - 1)];
      yearlyBalance.push(row.balance);
      yearlyInterest.push(rows.slice(0, y * 12).reduce((s, r) => s + r.interest, 0));
    }

    return { monthlyPayment, totalInterest, totalCost: P + totalInterest, rows, yearlyLabels, yearlyBalance, yearlyInterest };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Loan Calculator with Amortization Schedule"
      description="Calculate monthly payments for personal loans, auto loans, or any installment loan. See the full payment-by-payment breakdown and total interest paid."
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
          <InputField id="loanAmount" label="Loan Amount" value={vals.loanAmount} onChange={set("loanAmount")} prefix="$" tooltip="The total amount you are borrowing" />
          <InputField id="interestRate" label="Annual Interest Rate (APR)" value={vals.interestRate} onChange={set("interestRate")} suffix="%" step={0.1} tooltip="The annual percentage rate on your loan" />
          <InputField id="loanTerm" label="Loan Term" value={vals.loanTerm} onChange={set("loanTerm")} suffix="years" min={1} max={10} tooltip="How many years to repay the loan" />
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultsCard results={[
            { label: "Monthly Payment", value: fmtFull(calc.monthlyPayment), highlight: true },
            { label: "Total Interest Paid", value: fmt(calc.totalInterest) },
            { label: "Total Cost of Loan", value: fmt(calc.totalCost) },
          ]} />
          <div className="ad-slot">Advertisement</div>
          <FinancialChart type="line" title="Loan Balance Over Time" data={{
            labels: calc.yearlyLabels,
            datasets: [
              { label: "Remaining Balance", data: calc.yearlyBalance, color: "#8b5cf6", fill: true },
              { label: "Cumulative Interest", data: calc.yearlyInterest, color: "#f87171", fill: false },
            ],
          }} />
          <AmortizationTable rows={calc.rows} />
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">How the Loan Calculator Works</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          This loan calculator uses the standard amortization formula to compute your exact monthly payment for personal loans, auto loans, student loans, or any fixed-rate installment loan. Enter your principal, rate, and term to instantly see your payment schedule.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          The full amortization schedule breaks down every single payment into principal (what reduces your loan balance) and interest (what the lender keeps). Early payments are mostly interest; later payments shift towards principal — this is the nature of amortized loans.
        </p>
      </article>

      <FAQSection items={FAQ_ITEMS} pageName="Loan Calculator" />
    </CalculatorLayout>
  );
}
