"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  pageName: string;
}

export function FAQSection({ items, pageName }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <h2 className="text-2xl font-bold text-white mb-6">
        Frequently Asked Questions — {pageName}
      </h2>

      {/* Ad slot — in-article */}
      <div className="ad-slot mb-6">Advertisement</div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden transition-all duration-200"
            style={{
              border: openIndex === i
                ? "1px solid rgba(0,208,132,0.3)"
                : "1px solid rgba(30,58,112,0.3)",
              background: openIndex === i
                ? "rgba(0,208,132,0.04)"
                : "rgba(10,22,40,0.5)",
            }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              aria-expanded={openIndex === i}
            >
              <span className="text-sm font-semibold text-white pr-4">{item.question}</span>
              {openIndex === i ? (
                <ChevronDown size={16} style={{ color: "#00d084", flexShrink: 0 }} />
              ) : (
                <ChevronRight size={16} style={{ color: "#6b7280", flexShrink: 0 }} />
              )}
            </button>
            {openIndex === i && (
              <div
                className="px-5 pb-4 text-sm leading-relaxed animate-fade-in-up"
                style={{ color: "#9ca3af" }}
              >
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
