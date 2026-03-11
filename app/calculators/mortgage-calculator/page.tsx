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

const DEFAULTS = {
  homePrice: "400000",
  downPayment: "80000",
  loanTerm: "30",
  interestRate: "7",
  propertyTax: "2400",
  homeInsurance: "1200",
  pmi: "0.5",
  extraPayment: "0",
};

const FAQ_ITEMS = [
  {
    question: "How is a mortgage payment calculated?",
    answer:
      "Your monthly mortgage payment uses the formula M = P[r(1+r)^n]/[(1+r)^n-1], where P is the loan principal, r is the monthly interest rate (annual rate ÷ 12), and n is the total number of payments (years × 12). This calculator adds property tax, homeowners insurance, and PMI on top.",
  },
  {
    question: "What is PMI and when can I remove it?",
    answer:
      "PMI (Private Mortgage Insurance) is required when your down payment is less than 20% of the home's value. Once your loan balance drops to 80% of the original home value (LTV ≤ 80%), you can request PMI cancellation. This calculator shows you exactly which month that happens.",
  },
  {
    question: "How do extra payments affect my mortgage?",
    answer:
      "Extra monthly payments go entirely toward principal, reducing your outstanding balance faster. This saves you significant interest over the life of the loan — often tens of thousands of dollars — and shortens your payoff timeline. Even $100/month extra can save years of payments.",
  },
  {
    question: "What's the difference between a 15-year and 30-year mortgage?",
    answer:
      "A 15-year mortgage has higher monthly payments but you pay far less total interest — typically 50-60% less. A 30-year mortgage has lower monthly payments but you pay more interest over time. Use this calculator to compare both scenarios by changing the loan term.",
  },
  {
    question: "Should I put 20% down on a house?",
    answer:
      "A 20% down payment eliminates PMI and gives you immediate equity, but it requires more upfront cash. A smaller down payment lets you buy sooner but adds PMI costs. The right choice depends on your savings, local market conditions, and opportunity cost of the capital.",
  },
];

const RELATED = [
  { href: "/calculators/loan-calculator", label: "Loan Calculator", description: "Personal & auto loan payments" },
  { href: "/calculators/budget-calculator", label: "Budget Calculator", description: "50/30/20 rule & custom budgets" },
  { href: "/calculators/savings-goal-calculator", label: "Savings Goal", description: "Save for a down payment" },
  { href: "/calculators/debt-payoff-calculator", label: "Debt Payoff", description: "Eliminate debt faster" },
  { href: "/calculators/net-worth-calculator", label: "Net Worth", description: "Track your total wealth" },
];

export default function MortgageCalculatorPage() {
  const [vals, setVals] = useState(DEFAULTS);

  const set = (k: keyof typeof DEFAULTS) => (v: string) =>
    setVals((prev) => ({ ...prev, [k]: v }));

  const reset = () => setVals(DEFAULTS);

  const calc = useMemo(() => {
    const homePrice = parseFloat(vals.homePrice) || 0;
    const downPayment = parseFloat(vals.downPayment) || 0;
    const principal = homePrice - downPayment;
    const annualRate = parseFloat(vals.interestRate) || 0;
    const monthlyRate = annualRate / 100 / 12;
    const termMonths = (parseFloat(vals.loanTerm) || 30) * 12;
    const propertyTaxMonthly = (parseFloat(vals.propertyTax) || 0) / 12;
    const insuranceMonthly = (parseFloat(vals.homeInsurance) || 0) / 12;
    const pmiRate = parseFloat(vals.pmi) || 0;
    const extraPayment = parseFloat(vals.extraPayment) || 0;

    // Base mortgage payment (P&I)
    let piPayment = 0;
    if (principal > 0 && monthlyRate > 0) {
      piPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);
    } else if (monthlyRate === 0) {
      piPayment = principal / termMonths;
    }

    // PMI calculation
    const ltv = homePrice > 0 ? (principal / homePrice) * 100 : 0;
    const pmiMonthly = ltv > 80 ? (principal * pmiRate) / 100 / 12 : 0;

    const totalMonthly = piPayment + propertyTaxMonthly + insuranceMonthly + pmiMonthly;

    // Amortization schedule
    const rows: AmortRow[] = [];
    let balance = principal;
    let totalInterest = 0;
    let pmiRemovalMonth: number | null = null;
    const pmiThreshold = homePrice * 0.8;

    for (let month = 1; month <= termMonths && balance > 0; month++) {
      const interestPaid = balance * monthlyRate;
      let principalPaid = piPayment - interestPaid + extraPayment;
      if (principalPaid > balance) principalPaid = balance;
      balance = Math.max(0, balance - principalPaid);
      totalInterest += interestPaid;

      if (pmiRemovalMonth === null && balance <= pmiThreshold) {
        pmiRemovalMonth = month;
      }

      rows.push({
        month,
        payment: piPayment + extraPayment,
        principal: principalPaid,
        interest: interestPaid,
        balance,
      });

      if (balance === 0) break;
    }

    const actualTermMonths = rows.length;
    const yearsEarlier = extraPayment > 0 ? ((termMonths - actualTermMonths) / 12).toFixed(1) : null;

    // Chart data (yearly aggregates)
    const yearlyLabels: string[] = [];
    const yearlyBalance: number[] = [];
    const yearlyTotalInterest: number[] = [];

    for (let y = 1; y <= Math.ceil(actualTermMonths / 12); y++) {
      yearlyLabels.push(`Yr ${y}`);
      const row = rows[Math.min(y * 12 - 1, rows.length - 1)];
      yearlyBalance.push(row.balance);
      yearlyTotalInterest.push(
        rows.slice(0, y * 12).reduce((sum, r) => sum + r.interest, 0)
      );
    }

    return {
      piPayment,
      totalMonthly,
      totalInterest,
      totalCost: principal + totalInterest,
      pmiRemovalMonth,
      ltv,
      yearsEarlier,
      actualTermMonths,
      rows,
      yearlyLabels,
      yearlyBalance,
      yearlyTotalInterest,
    };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Mortgage Calculator with Extra Payments"
      description="Calculate your monthly mortgage payment including property tax, insurance, and PMI. See your full amortization schedule and how extra payments save you money."
      relatedCalcs={RELATED}
    >
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Mortgage Calculator",
            applicationCategory: "FinanceApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: "Free mortgage calculator with extra payments, PMI removal date, and amortization table.",
          }),
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 space-y-4 h-fit"
          style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Calculator Inputs</h2>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:text-white"
              style={{ color: "#6b7280", background: "rgba(30,58,112,0.3)" }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <InputField id="homePrice" label="Home Price" value={vals.homePrice} onChange={set("homePrice")} prefix="$" tooltip="Total purchase price of the home" />
          <InputField id="downPayment" label="Down Payment" value={vals.downPayment} onChange={set("downPayment")} prefix="$" tooltip="Amount you pay upfront. 20% eliminates PMI." />
          <InputField id="loanTerm" label="Loan Term" value={vals.loanTerm} onChange={set("loanTerm")} suffix="years" min={1} max={30} tooltip="Typical loans are 15 or 30 years" />
          <InputField id="interestRate" label="Annual Interest Rate" value={vals.interestRate} onChange={set("interestRate")} suffix="%" step={0.1} tooltip="Your mortgage's annual percentage rate (APR)" />
          <InputField id="propertyTax" label="Annual Property Tax" value={vals.propertyTax} onChange={set("propertyTax")} prefix="$" tooltip="Find this on your property's tax records" />
          <InputField id="homeInsurance" label="Annual Home Insurance" value={vals.homeInsurance} onChange={set("homeInsurance")} prefix="$" tooltip="Homeowners insurance, typically $1,000–$2,000/year" />
          <InputField id="pmi" label="PMI Rate (if LTV > 80%)" value={vals.pmi} onChange={set("pmi")} suffix="%" step={0.1} tooltip="Usually 0.5–1.5% of the loan annually" />
          <InputField id="extraPayment" label="Extra Monthly Payment" value={vals.extraPayment} onChange={set("extraPayment")} prefix="$" tooltip="Any extra you pay monthly goes directly to principal" />
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3 space-y-5">
          <ResultsCard
            results={[
              { label: "Monthly Payment (P&I)", value: fmtFull(calc.piPayment), highlight: true },
              { label: "Total Monthly Payment", value: fmt(calc.totalMonthly), sub: "incl. tax, insurance, PMI" },
              { label: "Total Interest Paid", value: fmt(calc.totalInterest) },
              { label: "Total Cost of Loan", value: fmt(calc.totalCost) },
              {
                label: "PMI Removal",
                value: calc.pmiRemovalMonth ? `Month ${calc.pmiRemovalMonth}` : calc.ltv <= 80 ? "N/A (LTV ≤ 80%)" : "N/A",
                sub: calc.pmiRemovalMonth ? `After ${(calc.pmiRemovalMonth / 12).toFixed(1)} years` : undefined,
              },
              {
                label: "Payoff Timeline",
                value: `${(calc.actualTermMonths / 12).toFixed(1)} yrs`,
                sub: calc.yearsEarlier ? `${calc.yearsEarlier} yrs sooner with extra payments` : "Standard schedule",
              },
            ]}
          />

          {/* Ad slot below results */}
          <div className="ad-slot">Advertisement</div>

          <FinancialChart
            type="line"
            title="Loan Balance & Cumulative Interest Over Time"
            data={{
              labels: calc.yearlyLabels,
              datasets: [
                { label: "Remaining Balance", data: calc.yearlyBalance, color: "#3b82f6", fill: true },
                { label: "Cumulative Interest Paid", data: calc.yearlyTotalInterest, color: "#f87171", fill: false },
              ],
            }}
          />

          <AmortizationTable rows={calc.rows} />
        </div>
      </div>

      {/* Explanation */}
      <article
        className="mt-10 rounded-2xl p-8 prose-invert max-w-none"
        style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">
          How to Use the Mortgage Calculator with Extra Payments
        </h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          Our mortgage calculator gives you a complete picture of your home loan — not just the principal and 
          interest payment. Enter your home price, down payment, and loan details to instantly see your full monthly 
          payment including property tax, homeowners insurance, and PMI (if applicable).
        </p>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          <strong className="text-white">The mortgage payment formula</strong> used by this calculator is: 
          M = P[r(1+r)^n] / [(1+r)^n-1], where P is the loan principal (home price minus down payment), 
          r is the monthly interest rate (your annual rate divided by 12), and n is the total number of monthly 
          payments (loan term in years multiplied by 12).
        </p>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          <strong className="text-white">Extra payments are powerful.</strong> Even adding $200/month to a 
          $300,000, 30-year mortgage at 7% can save you over $90,000 in interest and cut nearly 7 years off 
          your loan. The extra payment field shows you exactly how much you save and when you&apos;ll be mortgage-free.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          <strong className="text-white">PMI removal:</strong> If your down payment is less than 20%, PMI is 
          automatically calculated. The calculator tells you the exact month your loan balance hits 80% of the 
          original home value, so you know when to call your lender to cancel PMI. This can save $100–$200/month.
        </p>
      </article>

      <FAQSection items={FAQ_ITEMS} pageName="Mortgage Calculator" />
    </CalculatorLayout>
  );
}
