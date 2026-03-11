import type { Metadata } from "next";
import Link from "next/link";
import {
  Home as HomeIcon,
  TrendingUp,
  CreditCard,
  PiggyBank,
  BarChart2,
  Calculator,
  Target,
  Percent,
  DollarSign,
  Briefcase,
  Shield,
  Lock,
  Zap,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "CalcSuite — Free Financial Calculator Suite | 15+ Tools",
  description:
    "Free online financial calculators: mortgage, loan amortization, compound interest, debt payoff, retirement savings, budget planning & more. No sign-up. Instant results.",
};

const calculators = [
  {
    href: "/calculators/mortgage-calculator",
    icon: HomeIcon,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    label: "Mortgage Calculator",
    desc: "Monthly payments, PMI removal, amortization table",
    badge: "Most Popular",
  },
  {
    href: "/calculators/loan-calculator",
    icon: DollarSign,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    label: "Loan Calculator",
    desc: "Personal & auto loans with full amortization schedule",
  },
  {
    href: "/calculators/compound-interest-calculator",
    icon: TrendingUp,
    color: "#00d084",
    bg: "rgba(0,208,132,0.1)",
    label: "Compound Interest",
    desc: "Watch your money grow with monthly contributions",
    badge: "High Traffic",
  },
  {
    href: "/calculators/debt-payoff-calculator",
    icon: CreditCard,
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    label: "Debt Payoff",
    desc: "Avalanche vs snowball method comparison",
  },
  {
    href: "/calculators/retirement-calculator",
    icon: PiggyBank,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    label: "Retirement Savings",
    desc: "Inflation-adjusted retirement projections",
  },
  {
    href: "/calculators/roi-calculator",
    icon: BarChart2,
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
    label: "ROI Calculator",
    desc: "Investment return on equity & annualized returns",
  },
  {
    href: "/calculators/credit-card-payoff-calculator",
    icon: CreditCard,
    color: "#ec4899",
    bg: "rgba(236,72,153,0.1)",
    label: "Credit Card Payoff",
    desc: "Min payment vs fixed — see total interest paid",
  },
  {
    href: "/calculators/savings-goal-calculator",
    icon: Target,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    label: "Savings Goal",
    desc: "How long to save $X with monthly contributions",
  },
  {
    href: "/calculators/simple-interest-calculator",
    icon: Percent,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    label: "Simple Interest",
    desc: "Fast I = Prt calculations for any loan or deposit",
  },
  {
    href: "/calculators/inflation-calculator",
    icon: TrendingUp,
    color: "#fb923c",
    bg: "rgba(251,146,60,0.1)",
    label: "Inflation Calculator",
    desc: "Purchasing power of money over time",
  },
  {
    href: "/calculators/net-worth-calculator",
    icon: DollarSign,
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    label: "Net Worth Calculator",
    desc: "Assets minus liabilities with category breakdown",
  },
  {
    href: "/calculators/hourly-to-salary-calculator",
    icon: Briefcase,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    label: "Hourly to Salary",
    desc: "Annual salary with tax estimate from hourly rate",
  },
  {
    href: "/calculators/emergency-fund-calculator",
    icon: Shield,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    label: "Emergency Fund",
    desc: "How much buffer do you actually need?",
  },
  {
    href: "/calculators/budget-calculator",
    icon: Calculator,
    color: "#818cf8",
    bg: "rgba(129,140,248,0.1)",
    label: "Budget Calculator",
    desc: "50/30/20 rule with custom category allocation",
  },
  {
    href: "/calculators/break-even-calculator",
    icon: BarChart2,
    color: "#e879f9",
    bg: "rgba(232,121,249,0.1)",
    label: "Break-Even Calculator",
    desc: "When does your business become profitable?",
  },
];

const features = [
  { icon: Zap, label: "Instant Results", desc: "Calculations update as you type — no submit button" },
  { icon: Shield, label: "100% Private", desc: "All math runs in your browser. Zero data sent anywhere" },
  { icon: Lock, label: "No Sign-Up", desc: "Start calculating immediately, no account needed" },
  { icon: Globe, label: "Free Forever", desc: "Every tool, every feature, always free to use" },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--navy-950)" }}>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,208,132,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-5xl mx-auto text-center relative">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{
              background: "rgba(0,208,132,0.1)",
              border: "1px solid rgba(0,208,132,0.3)",
              color: "#00d084",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            15+ Free Financial Calculators — No Sign-Up Required
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Make smarter{" "}
            <span className="gradient-text">financial decisions</span>
            <br />
            with instant calculations
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10" style={{ color: "#9ca3af" }}>
            15 professional-grade financial calculators — mortgage payments, loan amortization, compound interest, 
            debt payoff, retirement planning, and more. Instant results. Your data never leaves your device.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/calculators/mortgage-calculator"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold transition-all duration-200 hover:scale-105 hover:shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #00d084, #00a866)",
                color: "#fff",
                boxShadow: "0 0 40px rgba(0,208,132,0.3)",
              }}
            >
              Try Mortgage Calculator
            </Link>
            <Link
              href="#calculators"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: "rgba(30,58,112,0.4)",
                border: "1px solid rgba(30,58,112,0.6)",
                color: "#d1d5db",
              }}
            >
              Browse All Tools
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16">
            {[
              { value: "15+", label: "Calculators" },
              { value: "100%", label: "Free & Private" },
              { value: "0s", label: "Sign-Up Time" },
              { value: "$0", label: "Monthly Cost" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black" style={{ color: "#00d084" }}>{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 px-4" style={{ borderTop: "1px solid rgba(30,58,112,0.2)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center text-center p-5 rounded-2xl"
              style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}
            >
              <f.icon size={22} style={{ color: "#00d084", marginBottom: 10 }} />
              <div className="text-sm font-semibold text-white mb-1">{f.label}</div>
              <div className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Calculator Grid */}
      <section id="calculators" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              All Financial Calculators
            </h2>
            <p style={{ color: "#6b7280" }}>
              Every tool you need to take control of your money, free forever.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group relative flex flex-col p-5 rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5"
                style={{
                  background: "rgba(15,32,66,0.5)",
                  border: "1px solid rgba(30,58,112,0.35)",
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 0% 0%, ${calc.color}15, transparent 70%)` }}
                />

                {calc.badge && (
                  <span
                    className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${calc.color}22`, color: calc.color, border: `1px solid ${calc.color}44` }}
                  >
                    {calc.badge}
                  </span>
                )}

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ background: calc.bg }}
                >
                  <calc.icon size={20} style={{ color: calc.color }} />
                </div>

                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-white transition-colors">
                  {calc.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                  {calc.desc}
                </p>

                <div
                  className="mt-4 flex items-center text-xs font-semibold transition-all duration-200 group-hover:gap-2"
                  style={{ color: calc.color }}
                >
                  Open Calculator →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div
          className="max-w-3xl mx-auto text-center rounded-3xl p-12"
          style={{
            background: "linear-gradient(135deg, rgba(0,208,132,0.1), rgba(59,130,246,0.08))",
            border: "1px solid rgba(0,208,132,0.2)",
          }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="mb-8" style={{ color: "#9ca3af" }}>
            Start with our most popular calculator — fully free, no registration required.
          </p>
          <Link
            href="/calculators/mortgage-calculator"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #00d084, #3b82f6)" }}
          >
            Start Calculating Now — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  );
}
