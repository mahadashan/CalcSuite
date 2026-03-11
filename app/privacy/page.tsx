import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — CalcSuite",
  description: "CalcSuite Privacy Policy. All calculations run locally in your browser — no data is ever collected or transmitted.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--navy-950)" }}>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm mb-10" style={{ color: "#6b7280" }}>Effective date: January 1, 2025. Last updated: March 2025.</p>

        <article className="space-y-8 text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">Our Core Promise</h2>
            <p className="p-4 rounded-xl mb-4" style={{ background: "rgba(0,208,132,0.08)", border: "1px solid rgba(0,208,132,0.2)", color: "#d1d5db" }}>
              <strong className="text-white">CalcSuite does not collect, store, or transmit any personal data or financial information you enter into any calculator.</strong> All calculations are performed entirely in your browser using JavaScript. Nothing is sent to our servers.
            </p>
          </section>

          {[
            {
              title: "Information We Do Not Collect",
              content: "We do not collect: financial figures you enter (loan amounts, income, debts, etc.), calculation results, personal identification information, browsing history within the calculator tools, or location data."
            },
            {
              title: "Analytics (Aggregated Only)",
              content: "We use Google Analytics 4 to understand aggregate usage patterns such as which calculators are most popular, geographic breakdown of visitors, and device types. This data is anonymized and aggregated — it cannot be tied to an individual user. You can opt out via Google's opt-out browser add-on."
            },
            {
              title: "Advertising",
              content: "CalcSuite displays Google AdSense advertisements. Google may use cookies to serve personalized ads based on your browsing history. We do not control Google's data collection for advertising purposes. You can manage ad personalization at adssettings.google.com."
            },
            {
              title: "Cookies",
              content: "We use minimal first-party cookies to remember your theme preference (dark/light mode). Google Analytics and Google AdSense may set their own cookies. No cookies contain your financial data."
            },
            {
              title: "Third-Party Links",
              content: "Our calculator explanation sections may contain affiliate links to financial products (mortgage lenders, investment platforms, budgeting tools). These third-party sites have their own privacy policies. We are not responsible for their data practices."
            },
            {
              title: "Children's Privacy",
              content: "CalcSuite is not directed to children under 13. We do not knowingly collect information from children."
            },
            {
              title: "Contact",
              content: "Questions about this privacy policy? Email us at privacy@calcsuite.io. We will respond within 5 business days."
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
