"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "@/i18n/store";
import { t } from "@/i18n/messages";

interface QuizTerminalProps {
  scenario: string;
  questionNumber: number; // 1-7
}

const BOOT_LINES = [
  "[ 0.000000] INITIALIZING KERNEL AUDIT VERSION 2.0.4",
  "[ 0.043512] ATTACHING NEURAL DECODER...",
  "[ 0.122894] SYSCALL INTERCEPTOR ACTIVE",
];

export default function QuizTerminal({ scenario, questionNumber }: QuizTerminalProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [done, setDone] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const msg = t(language);

  // Typing animation — reset when scenario changes
  useEffect(() => {
    setDisplayedText("");
    setDone(false);

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayedText(scenario.slice(0, index));
      if (index >= scenario.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [scenario]);

  return (
    <div className="bg-[#0E0E0E] border border-[#3B4B37]/40 glow-border">
      {/* Terminal header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#3B4B37]/40 bg-[#1C1B1B]">
        <span className="text-[10px] uppercase tracking-widest text-[#84967E] font-mono">
          CORE_PROCESS_ID: 9942-X
        </span>
        <div className="flex items-center gap-1.5">
          {/* 3 terminal control squares */}
          <div className="w-2.5 h-2.5 bg-[#3B4B37]/60" />
          <div className="w-2.5 h-2.5 bg-[#3B4B37]/60" />
          <div className="w-2.5 h-2.5 bg-[#00FF41] shadow-[0_0_4px_#00FF41]" />
        </div>
      </div>

      {/* Content area */}
      <div className="p-5">
        {/* Boot log lines */}
        <div className="mb-4 space-y-0.5">
          {BOOT_LINES.map((line, i) => (
            <p key={i} className="text-[10px] font-mono text-[#3B4B37] tracking-wider">
              {line}
            </p>
          ))}
        </div>

        {/* Question number label */}
        <p className="text-[9px] uppercase tracking-widest text-[#84967E] mb-1">
          Q_{String(questionNumber).padStart(2, "0")} / {msg.questionDecisionPoint}
        </p>

        {/* Scenario text with double border */}
        <div className="border-4 border-double border-[#00FF41] p-4 mt-2">
          <p className="text-[#00FF41] glow-text text-sm font-mono leading-relaxed min-h-[3rem]">
            {displayedText}
            {!done && (
              <span className="cursor-blink ml-0.5 text-[#00FF41]">_</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
