"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categoryTips } from "@/data/characters";

interface InsightPanelProps {
  weakCategories: string[];
  categoryScores: Record<string, { score: number; tokenImpact: number }>;
}

interface InsightItemProps {
  cat: string;
  score: number;
}

function InsightItem({ cat, score }: InsightItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const tip = categoryTips[cat];

  if (!tip) return null;

  const handleCopy = () => {
    if (!tip.snippet) return;
    navigator.clipboard.writeText(tip.snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="border border-[#3B4B37]/30 overflow-hidden">
      {/* Header — toggle */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#131313] transition-colors duration-150"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {score <= 1 && (
            <span
              className="text-[10px] font-bold"
              style={{ color: "#FFB4AB", textShadow: "0 0 6px #FFB4AB80" }}
              aria-label="Warning"
            >
              [!]
            </span>
          )}
          <span className="text-xs font-bold tracking-wider text-[#E5E2E1] uppercase">
            {tip.categoryLabel}
          </span>
          <span className="text-[10px] text-[#84967E]">({score}/3)</span>
        </div>
        <span
          className="text-[#84967E] text-xs transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}
        >
          ▼
        </span>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 pt-2 border-t border-[#3B4B37]/20">
              {/* Guide text */}
              <p className="text-xs text-[#84967E] leading-relaxed mb-4">
                {tip.guide}
              </p>

              {/* Snippet code block */}
              {tip.snippet && (
                <div className="relative">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#131313] border border-[#3B4B37]/30 border-b-0">
                    <span className="text-[9px] uppercase tracking-widest text-[#3B4B37]">
                      SNIPPET
                    </span>
                    <button
                      onClick={handleCopy}
                      className="text-[9px] uppercase tracking-widest font-bold transition-colors duration-150"
                      style={{
                        color: copied ? "#00FF41" : "#84967E",
                      }}
                    >
                      {copied ? "COPIED!" : "COPY"}
                    </button>
                  </div>
                  <pre className="bg-[#131313] border border-[#3B4B37]/30 px-3 py-3 text-[11px] font-mono text-[#33FF33] overflow-x-auto leading-relaxed whitespace-pre">
                    {tip.snippet}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InsightPanel({
  weakCategories,
  categoryScores,
}: InsightPanelProps) {
  if (weakCategories.length === 0) {
    return (
      <div className="bg-[#0E0E0E] border border-[#3B4B37]/15 p-6">
        <p className="text-[9px] uppercase tracking-widest text-[#84967E] mb-4">
          ACTIONABLE_INSIGHTS
        </p>
        <p className="text-xs text-[#33FF33] tracking-wider">
          [OK] ALL_CATEGORIES_OPTIMAL — No weak areas detected.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0E0E0E] border border-[#3B4B37]/15 p-6">
      <p className="text-[9px] uppercase tracking-widest text-[#84967E] mb-1">
        ACTIONABLE_INSIGHTS
      </p>
      <p className="text-[10px] text-[#3B4B37] mb-4">
        {weakCategories.length} area{weakCategories.length !== 1 ? "s" : ""} flagged for improvement
      </p>

      <div className="space-y-2">
        {weakCategories.map((cat) => {
          const score = categoryScores[cat]?.score ?? 0;
          return <InsightItem key={cat} cat={cat} score={score} />;
        })}
      </div>
    </div>
  );
}
