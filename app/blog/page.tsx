import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — CalcSuite Personal Finance",
  description: "Articles on personal finance, budgeting, investing, and making the most of our financial calculators.",
};

const POSTS = [
  {
    title: "The Mathematical Truth About Minimum Credit Card Payments",
    date: "March 15, 2025",
    slug: "minimum-credit-card-payments",
    excerpt: "Why paying just 2% of your balance keeps you in debt for decades, and the exact dollar amount you save by switching to fixed payments.",
    category: "Debt"
  },
  {
    title: "How to Build an Anti-Fragile Emergency Fund",
    date: "March 5, 2025",
    slug: "anti-fragile-emergency-fund",
    excerpt: "The 3-tier strategy for structuring your emergency fund so you never have to sell investments or take on high-interest debt during a crisis.",
    category: "Savings"
  },
  {
    title: "Avalanche vs. Snowball: Which Debt Payoff Method Actually Works?",
    date: "February 22, 2025",
    slug: "avalanche-vs-snowball",
    excerpt: "The math favors the Avalanche method, but human psychology favors the Snowball method. Here's how to decide which is right for your specific debt profile.",
    category: "Debt"
  },
  {
    title: "Understanding the 50/30/20 Budgeting Matrix",
    date: "February 10, 2025",
    slug: "understanding-50-30-20-budget",
    excerpt: "The simplest budgeting framework remains the most effective. How to adapt the 50/30/20 rule if you live in a high-cost-of-living area.",
    category: "Budgeting"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--navy-950)" }}>
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">The CalcSuite Blog</h1>
          <p className="text-xl" style={{ color: "#9ca3af" }}>
            Data-driven insights to help you master your money.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {POSTS.map((post) => (
            <div key={post.slug} className="group p-6 rounded-2xl transition-all hover:scale-[1.02]" style={{ background: "rgba(15,32,66,0.5)", border: "1px solid rgba(30,58,112,0.4)" }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: "rgba(0,208,132,0.1)", color: "#00d084" }}>{post.category}</span>
                <span className="text-xs" style={{ color: "#6b7280" }}>{post.date}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#00d084] transition-colors">{post.title}</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>{post.excerpt}</p>
              <div className="text-sm font-medium" style={{ color: "#00d084" }}>Read article →</div>
            </div>
          ))}
        </div>

        <div className="w-full max-w-2xl p-8 rounded-2xl text-center" style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(30,58,112,0.3)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(0,208,132,0.1)" }}>
            <Calculator size={24} style={{ color: "#00d084" }} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Ready to run the numbers?</h3>
          <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>Stop guessing and start calculating. Our suite of 15 tools is completely free.</p>
          <Link href="/" className="inline-block px-6 py-3 rounded-xl text-white font-bold transition-transform hover:scale-105" style={{ background: "var(--accent-green)" }}>
            Explore All Calculators
          </Link>
        </div>

      </div>
    </div>
  );
}
