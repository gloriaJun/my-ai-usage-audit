import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MY-AI-USAGE-AUDIT | Are you using AI efficiently?",
  description:
    "Diagnose your AI coding habits. 7 questions to reveal your Claude Code usage pattern.",
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
