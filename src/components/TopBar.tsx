"use client";

import LanguageToggle from "@/components/common/LanguageToggle";
import { useLanguageStore } from "@/i18n/store";
import { t } from "@/i18n/messages";

interface TopBarProps {
  mode: "quiz" | "result";
  currentStep?: number; // 0-6
  onRetry?: () => void;
}

export default function TopBar({ mode, currentStep = 0, onRetry }: TopBarProps) {
  const totalSteps = 7;
  const language = useLanguageStore((state) => state.language);
  const msg = t(language);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#131313] border-b border-[#3B4B37]/20 px-3 py-2.5 sm:px-6 sm:py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left */}
        {mode === "quiz" ? (
          <span className="text-[#00FF41] font-bold tracking-wide uppercase text-xs sm:text-xl sm:tracking-widest glow-text">
            MY-AI-USAGE-AUDIT
          </span>
        ) : (
          <span className="text-[#00FF41] font-bold tracking-wide uppercase text-xs sm:text-xl sm:tracking-widest glow-text">
            {msg.auditComplete}
          </span>
        )}

        {/* Right */}
        {mode === "quiz" ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageToggle />
            <span className="text-[#00FF41] text-[10px] sm:text-sm tracking-wide sm:tracking-widest uppercase">
              {msg.step} {String(currentStep + 1).padStart(2, "0")}/
              {String(totalSteps).padStart(2, "0")}
            </span>
            {/* Mini progress blocks */}
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-2 ${
                    i < currentStep
                      ? "bg-[#00FF41]"
                      : i === currentStep
                      ? "bg-[#00FF41] animate-pulse"
                      : "bg-[#3B4B37]/30"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <button
              onClick={onRetry}
              className="border border-[#00FF41] text-[#00FF41] px-2.5 py-1 text-[10px] sm:px-4 sm:py-1.5 sm:text-sm tracking-wide sm:tracking-widest uppercase transition-all duration-200 hover:bg-[#00FF41] hover:text-[#131313]"
            >
              {msg.retryAudit}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
