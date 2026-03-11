import Link from "next/link";
import { Shield, Lock, ChevronRight } from "lucide-react";

interface RelatedCalc {
  href: string;
  label: string;
  description: string;
}

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  relatedCalcs?: RelatedCalc[];
}

export function CalculatorLayout({
  title,
  description,
  children,
  relatedCalcs = [],
}: CalculatorLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: "var(--navy-950)" }}>
      {/* Header */}
      <div
        className="py-10 px-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,22,40,0.95) 0%, rgba(4,13,26,0.95) 100%)",
          borderBottom: "1px solid rgba(30,58,112,0.3)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: "#6b7280" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/" className="hover:text-white transition-colors">Calculators</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#00d084" }}>{title}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{title}</h1>
          <p className="text-base max-w-2xl" style={{ color: "#9ca3af" }}>{description}</p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-4 mt-5">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6b7280" }}>
              <Shield size={13} style={{ color: "#00d084" }} />
              <span>Your data never leaves your device</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6b7280" }}>
              <Lock size={13} style={{ color: "#00d084" }} />
              <span>No sign-up required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ad slot — leaderboard above calculator */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="ad-slot text-center mb-2">Advertisement</div>
      </div>

      {/* Calculator content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </div>

      {/* Related Calculators */}
      {relatedCalcs.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-white mb-4">Related Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedCalcs.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="flex items-center justify-between p-4 rounded-xl group transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: "rgba(15,32,66,0.5)",
                  border: "1px solid rgba(30,58,112,0.4)",
                }}
              >
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors">
                    {calc.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                    {calc.description}
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="flex-shrink-0 ml-2 transition-transform group-hover:translate-x-1"
                  style={{ color: "#00d084" }}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
