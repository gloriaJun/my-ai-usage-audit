"use client";

import { useEffect, useState } from "react";
import { useLanguageStore } from "@/i18n/store";
import { t } from "@/i18n/messages";

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function StatusFooter() {
  const [uptime, setUptime] = useState(0);
  const language = useLanguageStore((state) => state.language);
  const msg = t(language);
  const year = new Date().getFullYear();
  const copyrightText = msg.copyright.replace("{year}", String(year));
  const repoUrl = "https://github.com/gloriaJun/my-ai-usage-audit";

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 bg-[#0E0E0E] border-t border-[#3B4B37]/20 px-3 py-2 sm:px-6">
      <div className="flex flex-col gap-1 sm:gap-0">
        <div className="flex items-center justify-between">
          {/* Left: status indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse shadow-[0_0_5px_#00FF41]" />
            <span className="text-[9px] uppercase tracking-widest text-[#00FF41] font-bold">
              {msg.systemLive}
            </span>
          </div>

          {/* Right: secure node + repo */}
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-wide sm:tracking-widest text-[#84967E]">
            <span className="hidden md:inline">{msg.secureNode}</span>
            <span>&#x1F512;</span>
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-[#84967E] hover:text-[#00FF41] transition-colors"
              aria-label="GitHub repository"
            >
              <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
                <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-.95-2.7-.95-.37-.94-.9-1.19-.9-1.19-.74-.5.05-.49.05-.49.82.06 1.25.84 1.25.84.72 1.23 1.9.88 2.36.67.07-.53.28-.88.5-1.08-1.78-.2-3.65-.89-3.65-3.96 0-.88.31-1.6.83-2.17-.08-.2-.36-1.01.08-2.1 0 0 .67-.21 2.2.83A7.67 7.67 0 0 1 8 4.77c.68 0 1.37.09 2.01.27 1.53-1.04 2.2-.83 2.2-.83.44 1.09.16 1.9.08 2.1.52.57.83 1.29.83 2.17 0 3.08-1.87 3.76-3.66 3.96.29.25.55.73.55 1.47v2.19c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
              </svg>
              <span className="hidden sm:inline">{msg.githubRepo}</span>
            </a>
          </div>
        </div>

        {/* Mobile: compact stats */}
        <div className="text-[8px] uppercase tracking-wide text-[#84967E] sm:hidden">
          UPTIME: {formatUptime(uptime)} <span className="mx-1">|</span> {copyrightText}
        </div>

        {/* Desktop: full stats */}
        <div className="hidden sm:block text-[9px] uppercase tracking-widest text-[#84967E]">
          CPU_TEMP: 42°C&nbsp;&nbsp;|&nbsp;&nbsp;MEM_USAGE: 64.2GB&nbsp;&nbsp;|&nbsp;&nbsp;UPTIME: {formatUptime(uptime)}
          <span className="mx-2">|</span>
          {copyrightText}
        </div>
      </div>
    </footer>
  );
}
