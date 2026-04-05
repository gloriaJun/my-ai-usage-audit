import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://my-ai-usage-audit.vercel.app";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MY-AI-USAGE-AUDIT | Are you using AI efficiently?",
  description:
    "Diagnose your AI coding habits. 7 questions to reveal your Claude Code usage pattern.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MY-AI-USAGE-AUDIT | Are you using AI efficiently?",
    description:
      "Diagnose your AI coding habits. 7 questions to reveal your Claude Code usage pattern.",
    url: siteUrl,
    siteName: "MY-AI-USAGE-AUDIT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MY-AI-USAGE-AUDIT | Are you using AI efficiently?",
    description:
      "Diagnose your AI coding habits. 7 questions to reveal your Claude Code usage pattern.",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${spaceGrotesk.variable} dark`}>
      <body className="min-h-screen bg-surface text-on-surface font-sans selection:bg-primary selection:text-surface">
        <div className="crt-overlay" />
        {children}
      </body>
    </html>
  );
}
