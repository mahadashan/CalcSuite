import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — CalcSuite",
  description: "CalcSuite Terms of Service. Free financial calculators provided for informational purposes only.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--navy-950)" }}>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm mb-10" style={{ color: "#6b7280" }}>Effective date: January 1, 2025.</p>

        <article className="space-y-8 text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          <section>
            <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#d1d5db" }}>
              <strong className="text-white">Important:</strong> CalcSuite calculators are provided for informational and educational purposes only. They do not constitute financial, legal, tax, or investment advice. Always consult a qualified financial professional before making major financial decisions.
            </div>
          </section>

          {[
            {
              title: "1. Acceptance of Terms",
              content: "By accessing or using CalcSuite (\"the Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service."
            },
            {
              title: "2. Description of Service",
              content: "CalcSuite provides free, client-side financial calculation tools. All calculations are performed in your web browser. The Service is provided 'as is' without warranties of any kind."
            },
            {
              title: "3. Accuracy & Disclaimer",
              content: "While we strive for accuracy, CalcSuite does not guarantee that calculator results are accurate, complete, or current. Formulas are based on standard financial calculations, but your actual results may differ based on factors not accounted for by the calculator (taxes, fees, changing rates, etc.)."
            },
            {
              title: "4. No Financial Advice",
              content: "Nothing on CalcSuite constitutes financial advice, investment advice, or a recommendation to buy or sell any financial product. Always consult a licensed financial advisor, CPA, or other qualified professional."
            },
            {
              title: "5. Intellectual Property",
              content: "The CalcSuite brand, design, and content are owned by CalcSuite and protected by copyright law. You may not reproduce, distribute, or create derivative works without written permission."
            },
            {
              title: "6. Advertising",
              content: "CalcSuite displays advertisements through Google AdSense and may include affiliate links. Affiliate commissions do not affect our calculator results or editorial content."
            },
            {
              title: "7. Limitation of Liability",
              content: "CalcSuite and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service or reliance on its results."
            },
            {
              title: "8. Changes to Terms",
              content: "We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms."
            },
            {
              title: "9. Contact",
              content: "Questions about these terms? Contact us at legal@calcsuite.io"
            }
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-bold text-white mb-2">{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
