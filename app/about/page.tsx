import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CalcSuite — Free Financial Calculator Suite",
  description: "Learn about CalcSuite, our mission to make financial literacy accessible to everyone with free, private, no-sign-up calculators.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--navy-950)" }}>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">About CalcSuite</h1>
        <p className="text-xl mb-12" style={{ color: "#9ca3af" }}>
          We believe everyone deserves professional-grade financial tools — without paying for them.
        </p>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="mb-4">
              CalcSuite was built on a simple idea: the math behind personal finance is not complicated — it&apos;s just inaccessible. A mortgage amortization calculation is a formula, not a secret. Compound interest isn&apos;t magic — it&apos;s exponents. Anyone with the right tool can make exactly the same calculations that financial advisors use.
            </p>
            <p>
              We built 15 calculators covering the most important personal finance decisions most people face: buying a home, paying off debt, planning for retirement, managing a budget. Every single calculator is free, requires no sign-up, and runs entirely in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Why We Built This</h2>
            <p className="mb-4">
              When we needed to calculate whether we could afford a house, the existing tools were frustratingly limited — basic inputs, no amortization tables, no extra payment modeling, no PMI removal dates. We wanted something better.
            </p>
            <p>So we built it. Then we kept going.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Our Privacy Commitment</h2>
            <div className="p-5 rounded-2xl" style={{ background: "rgba(0,208,132,0.06)", border: "1px solid rgba(0,208,132,0.2)" }}>
              <p className="text-white font-medium mb-2">Your financial data is yours. Period.</p>
              <p>Every calculation on CalcSuite runs entirely in your browser using JavaScript. The numbers you type into our mortgage calculator never touch our servers. We deliberately chose this architecture because financial data is sensitive, and we believe the safest data is data that&apos;s never collected.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Get Started</h2>
            <p className="mb-6">Explore our most popular calculators:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/calculators/mortgage-calculator", label: "Mortgage Calculator" },
                { href: "/calculators/compound-interest-calculator", label: "Compound Interest" },
                { href: "/calculators/debt-payoff-calculator", label: "Debt Payoff" },
                { href: "/calculators/retirement-calculator", label: "Retirement Savings" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="px-4 py-3 rounded-xl text-white font-medium transition-all hover:scale-[1.02]"
                  style={{ background: "rgba(15,32,66,0.6)", border: "1px solid rgba(30,58,112,0.4)" }}>
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
