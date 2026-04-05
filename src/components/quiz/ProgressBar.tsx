"use client";

import { motion } from "framer-motion";
import { useLanguageStore } from "@/i18n/store";
import { t } from "@/i18n/messages";

interface ProgressBarProps {
  currentStep: number; // 0-6
  totalSteps?: number;
}

export default function ProgressBar({ currentStep, totalSteps = 7 }: ProgressBarProps) {
  const language = useLanguageStore((state) => state.language);
  const msg = t(language);

  return (
    <div className="w-full">
      {/* Labels */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-[#84967E] uppercase tracking-widest">
          {msg.progress}
        </span>
        <span className="text-[10px] font-bold text-[#00FF41]">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>

      {/* Blocks */}
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCurrent = i === currentStep;
          const isFuture = i > currentStep;

          return (
            <div key={i} className="flex-1 h-3 relative overflow-hidden">
              {isFuture ? (
                <div className="absolute inset-0 bg-[#3B4B37]/30" />
              ) : (
                <motion.div
                  className={`absolute inset-0 bg-[#00FF41] ${isCurrent ? "animate-pulse" : ""}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  style={{ originX: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
