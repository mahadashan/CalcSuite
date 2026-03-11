"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { InputField } from "@/components/InputField";
import { ResultsCard } from "@/components/ResultsCard";
import { FAQSection } from "@/components/FAQSection";
import { RotateCcw } from "lucide-react";

const fmt0 = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const DEFAULTS = { balance: "5000", apr: "22", minPctOrFixed: "2", fixedPayment: "200" };

const FAQ_ITEMS = [
  { question: "What is a minimum credit card payment?", answer: "Most credit cards charge the greater of either: a minimum flat fee ($25–$35) or a percentage of your outstanding balance (typically 1–3%). Paying only minimums can take decades to pay off even a moderate balance due to compound interest." },
  { question: "How much interest do credit cards charge?", answer: "The average credit card APR in the US (2024) is around 21–22%. Premium cards may charge 24–27%. Some store cards charge up to 30%+. At 22% APR, a $5,000 balance accrues ~$91 in interest every month." },
  { question: "Why does paying more than the minimum matter so much?", answer: "On a $5,000 balance at 22% APR, paying only the 2% minimum takes about 30 years and costs ~$8,000 in interest. Paying a fixed $200/month pays it off in about 3 years at a fraction of the interest cost." },
  { question: "What is a balance transfer and should I use one?", answer: "A balance transfer moves your debt to a new card with a promotional 0% APR period (usually 12–21 months). If you can pay off the balance before the promo ends, you avoid all interest. There is usually a 3–5% transfer fee." },
  { question: "What credit card APR is considered high?", answer: "Anything above 20% APR is considered high. Before 2022, many prime borrowers could get 15–17% rates. In the current rate environment, even excellent-credit customers often see 21–24%. Always prioritize paying off high-APR cards first (debt avalanche)." },
];

const RELATED = [
  { href: "/calculators/debt-payoff-calculator", label: "Debt Payoff", description: "Avalanche vs snowball method" },
  { href: "/calculators/loan-calculator", label: "Loan Calculator", description: "Personal loan comparison" },
  { href: "/calculators/budget-calculator", label: "Budget Calculator", description: "Find money to pay down debt" },
];

export default function CreditCardPayoffPage() {
  const [vals, setVals] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (v: string) => setVals((p) => ({ ...p, [k]: v }));
  const reset = () => setVals(DEFAULTS);

  const calc = useMemo(() => {
    const balance = parseFloat(vals.balance) || 0;
    const apr = parseFloat(vals.apr) / 100 || 0;
    const mr = apr / 12;
    const minPct = parseFloat(vals.minPctOrFixed) / 100 || 0.02;
    const fixedPmt = parseFloat(vals.fixedPayment) || 0;

    const simulate = (paymentFn: (b: number) => number) => {
      let b = balance;
      let months = 0;
      let totalInterest = 0;
      while (b > 0.01 && months < 1200) {
        const interest = b * mr;
        totalInterest += interest;
        const payment = Math.min(paymentFn(b), b + interest);
        b = b + interest - payment;
        months++;
      }
      return { months, totalInterest };
    };

    const minResult = simulate((b) => Math.max(b * minPct, 25));
    const fixedResult = simulate(() => fixedPmt);
    const interestSaved = minResult.totalInterest - fixedResult.totalInterest;

    return { minResult, fixedResult, interestSaved, balance };
  }, [vals]);

  return (
    <CalculatorLayout
      title="Credit Card Payoff Calculator — Minimum vs Fixed Payment"
      description="See how much interest you save by paying a fixed amount vs the minimum payment on your credit card. Find your debt-free date and total interest cost."
      relatedCalcs={RELATED}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 space-y-4 h-fit" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Your Credit Card</h2>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ color: "#6b7280", background: "rgba(30,58,112,0.3)" }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <InputField id="balance" label="Current Balance" value={vals.balance} onChange={set("balance")} prefix="$" />
          <InputField id="apr" label="Annual Interest Rate (APR)" value={vals.apr} onChange={set("apr")} suffix="%" step={0.5} tooltip="Check your card statement for APR" />
          <InputField id="minPct" label="Minimum Payment %" value={vals.minPctOrFixed} onChange={set("minPctOrFixed")} suffix="% of balance" step={0.5} min={1} max={10} tooltip="Typical minimum is 2% of balance or $25, whichever is greater" />
          <InputField id="fixedPayment" label="Fixed Monthly Payment" value={vals.fixedPayment} onChange={set("fixedPayment")} prefix="$" tooltip="The flat amount you'd pay each month instead" />
        </div>

        <div className="lg:col-span-3 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#f87171" }}>Minimum Payments Only</div>
              <div className="text-2xl font-bold text-white mb-1">{fmt0(calc.minResult.totalInterest)}</div>
              <div className="text-xs" style={{ color: "#9ca3af" }}>Total interest paid</div>
              <div className="mt-3 text-sm font-semibold text-white">{(calc.minResult.months / 12).toFixed(1)} years to pay off</div>
            </div>
            <div className="rounded-2xl p-5" style={{ background: "rgba(0,208,132,0.06)", border: "1px solid rgba(0,208,132,0.2)" }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#00d084" }}>Fixed ${parseFloat(vals.fixedPayment) || 0}/month</div>
              <div className="text-2xl font-bold text-white mb-1">{fmt0(calc.fixedResult.totalInterest)}</div>
              <div className="text-xs" style={{ color: "#9ca3af" }}>Total interest paid</div>
              <div className="mt-3 text-sm font-semibold text-white">{(calc.fixedResult.months / 12).toFixed(1)} years to pay off</div>
            </div>
          </div>

          <ResultsCard results={[
            { label: "Interest Saved", value: fmt0(calc.interestSaved), highlight: true, sub: "By choosing fixed payment" },
            { label: "Time Saved", value: `${((calc.minResult.months - calc.fixedResult.months) / 12).toFixed(1)} years` },
          ]} />
          <div className="ad-slot">Advertisement</div>
        </div>
      </div>

      <article className="mt-10 rounded-2xl p-8" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
        <h2 className="text-2xl font-bold text-white mb-4">Why Minimum Payments Are a Debt Trap</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          Credit card minimum payments are designed to keep you in debt as long as possible. At 22% APR, a $5,000 balance paid at minimum (2%) can take 30+ years to eliminate and cost more than the original balance in interest alone. The math is stark: minimum payments mostly just cover interest.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          By committing to a fixed monthly payment — even if only slightly above the minimum — you dramatically shorten your payoff timeline and save thousands. Use this calculator to find the fixed payment amount that fits your budget while minimizing your total interest cost.
        </p>
      </article>
      <FAQSection items={FAQ_ITEMS} pageName="Credit Card Payoff Calculator" />
    </CalculatorLayout>
  );
}
