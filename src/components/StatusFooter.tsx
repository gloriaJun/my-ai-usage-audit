"use client";

import { useEffect, useState } from "react";

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function StatusFooter() {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 bg-[#0E0E0E] border-t border-[#3B4B37]/20 px-6 py-2">
      <div className="flex items-center justify-between">
        {/* Left: status indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse shadow-[0_0_5px_#00FF41]" />
          <span className="text-[9px] uppercase tracking-widest text-[#00FF41] font-bold">
            SYSTEM_LIVE
          </span>
        </div>

        {/* Center: system stats (hidden on mobile) */}
        <div className="hidden md:block text-[9px] uppercase tracking-widest text-[#84967E]">
          CPU_TEMP: 42°C&nbsp;&nbsp;|&nbsp;&nbsp;MEM_USAGE: 64.2GB&nbsp;&nbsp;|&nbsp;&nbsp;UPTIME: {formatUptime(uptime)}
        </div>

        {/* Right: secure node */}
        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#84967E]">
          <span>SECURE_NODE_ALPHA</span>
          <span>&#x1F512;</span>
        </div>
      </div>
    </footer>
  );
}
