"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Calculator, TrendingUp } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/calculators/mortgage-calculator", label: "Mortgage" },
  { href: "/calculators/loan-calculator", label: "Loan" },
  { href: "/calculators/compound-interest-calculator", label: "Invest" },
  { href: "/calculators/budget-calculator", label: "Budget" },
  { href: "/blog", label: "Blog" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(4, 13, 26, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(30, 58, 112, 0.4)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00d084, #3b82f6)" }}
            >
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              Calc<span style={{ color: "#00d084" }}>Suite</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: "rgba(156,163,175,1)" }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "#fff";
                  (e.target as HTMLElement).style.background = "rgba(30,58,112,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "rgba(156,163,175,1)";
                  (e.target as HTMLElement).style.background = "transparent";
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/#calculators"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #00d084, #00a866)", color: "#fff" }}
            >
              <Calculator size={14} />
              All Calculators
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: "#9ca3af" }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 space-y-1"
          style={{ borderTop: "1px solid rgba(30,58,112,0.3)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 rounded-lg text-sm font-medium"
              style={{ color: "#9ca3af" }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
