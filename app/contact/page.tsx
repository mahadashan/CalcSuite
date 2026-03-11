import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact CalcSuite",
  description: "Get in touch with the CalcSuite team for support, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--navy-950)" }}>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
        <p className="mb-10" style={{ color: "#9ca3af" }}>We&apos;d love to hear from you. Reach out for support, feedback, or partnership inquiries.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            { label: "General Inquiries", email: "hello@calcsuite.io" },
            { label: "Privacy Concerns", email: "privacy@calcsuite.io" },
            { label: "Legal / Terms", email: "legal@calcsuite.io" },
            { label: "Partnerships / Affiliates", email: "partnerships@calcsuite.io" },
          ].map((c) => (
            <div key={c.label} className="p-5 rounded-2xl" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>{c.label}</div>
              <a href={`mailto:${c.email}`} className="text-sm font-medium transition-colors hover:text-white" style={{ color: "#00d084" }}>{c.email}</a>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl" style={{ background: "rgba(15,32,66,0.4)", border: "1px solid rgba(30,58,112,0.3)" }}>
          <h2 className="text-lg font-bold text-white mb-3">Before You Contact Us</h2>
          <ul className="space-y-2 text-sm" style={{ color: "#9ca3af" }}>
            <li>• <strong className="text-white">Calculator results</strong> — All calculations use standard financial formulas. If a result seems wrong, double-check your inputs and compare to a second source.</li>
            <li>• <strong className="text-white">Financial advice</strong> — We cannot provide personal financial advice. Please consult a licensed financial advisor.</li>
            <li>• <strong className="text-white">Data privacy</strong> — No financial data you enter is stored. We cannot access it.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
