import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://calcsuite.io"),
  title: {
    default: "CalcSuite — Free Financial Calculator Suite",
    template: "%s | CalcSuite",
  },
  description:
    "Free online financial calculators: mortgage, loan, compound interest, debt payoff, retirement, budget, and more. No sign-up. Your data never leaves your device.",
  keywords: [
    "financial calculator",
    "mortgage calculator",
    "loan calculator",
    "compound interest calculator",
    "budget calculator",
    "retirement calculator",
  ],
  authors: [{ name: "CalcSuite" }],
  creator: "CalcSuite",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://calcsuite.io",
    siteName: "CalcSuite",
    title: "CalcSuite — Free Financial Calculator Suite",
    description:
      "15+ free financial calculators. No sign-up required. Instant results with charts and amortization tables.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CalcSuite — Free Financial Calculator Suite",
    description: "15+ free financial calculators. No sign-up required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`} style={{ background: "var(--navy-950)" }}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
