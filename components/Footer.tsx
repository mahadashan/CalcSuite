import Link from "next/link";
import { TrendingUp, Shield, Mail } from "lucide-react";

const calculatorLinks = [
  { href: "/calculators/mortgage-calculator", label: "Mortgage Calculator" },
  { href: "/calculators/loan-calculator", label: "Loan Calculator" },
  { href: "/calculators/compound-interest-calculator", label: "Compound Interest" },
  { href: "/calculators/debt-payoff-calculator", label: "Debt Payoff" },
  { href: "/calculators/retirement-calculator", label: "Retirement Savings" },
  { href: "/calculators/roi-calculator", label: "ROI Calculator" },
  { href: "/calculators/credit-card-payoff-calculator", label: "Credit Card Payoff" },
  { href: "/calculators/savings-goal-calculator", label: "Savings Goal" },
];

const moreLinks = [
  { href: "/calculators/budget-calculator", label: "Budget Calculator" },
  { href: "/calculators/net-worth-calculator", label: "Net Worth" },
  { href: "/calculators/inflation-calculator", label: "Inflation Calculator" },
  { href: "/calculators/simple-interest-calculator", label: "Simple Interest" },
  { href: "/calculators/hourly-to-salary-calculator", label: "Hourly to Salary" },
  { href: "/calculators/emergency-fund-calculator", label: "Emergency Fund" },
  { href: "/calculators/break-even-calculator", label: "Break-Even" },
];

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--navy-900)",
        borderTop: "1px solid rgba(30,58,112,0.4)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #00d084, #3b82f6)" }}
              >
                <TrendingUp size={16} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                Calc<span style={{ color: "#00d084" }}>Suite</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6b7280" }}>
              Free financial calculators for everyone. No sign-up, no data stored — just instant, accurate results.
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: "#6b7280" }}>
              <Shield size={14} style={{ color: "#00d084" }} />
              <span>Your data never leaves your device</span>
            </div>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Calculators
            </h3>
            <ul className="space-y-2">
              {calculatorLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-150 hover:text-white"
                    style={{ color: "#6b7280" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Calculators */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              More Tools
            </h3>
            <ul className="space-y-2">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-150 hover:text-white"
                    style={{ color: "#6b7280" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-150 hover:text-white"
                    style={{ color: "#6b7280" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 text-xs" style={{ color: "#6b7280" }}>
              <Mail size={14} />
              <a href="mailto:hello@calcsuite.io" className="hover:text-white transition-colors">
                hello@calcsuite.io
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: "1px solid rgba(30,58,112,0.3)", color: "#4b5563" }}
        >
          <p>© {new Date().getFullYear()} CalcSuite. All rights reserved. For informational purposes only — not financial advice.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
