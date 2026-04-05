"use client";

interface TopBarProps {
  mode: "quiz" | "result";
  currentStep?: number; // 0-6
  onRetry?: () => void;
}

export default function TopBar({ mode, currentStep = 0, onRetry }: TopBarProps) {
  const totalSteps = 7;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#131313] border-b border-[#3B4B37]/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left */}
        {mode === "quiz" ? (
          <span className="text-[#00FF41] font-bold tracking-widest uppercase text-xl glow-text">
            MY-AI-USAGE-AUDIT
          </span>
        ) : (
          <span className="text-[#00FF41] font-bold tracking-widest uppercase text-xl glow-text">
            AUDIT_COMPLETE
          </span>
        )}

        {/* Right */}
        {mode === "quiz" ? (
          <div className="flex items-center gap-4">
            <span className="text-[#00FF41] text-sm tracking-widest uppercase">
              STEP {String(currentStep + 1).padStart(2, "0")}/{String(totalSteps).padStart(2, "0")}
            </span>
            {/* Mini progress blocks */}
            <div className="flex gap-1">
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
          <button
            onClick={onRetry}
            className="border border-[#00FF41] text-[#00FF41] px-4 py-1.5 text-sm tracking-widest uppercase transition-all duration-200 hover:bg-[#00FF41] hover:text-[#131313]"
          >
            RETRY_AUDIT
          </button>
        )}
      </div>
    </header>
  );
}
