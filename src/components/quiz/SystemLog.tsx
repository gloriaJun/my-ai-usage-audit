"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguageStore } from "@/i18n/store";

interface SystemLogProps {
  messages: string[];
}

const BOOT_MESSAGES = [
  "AUDIT_ENGINE: Initializing diagnostic sequence...",
  "SYSCALL_INTERCEPTOR: Active and monitoring...",
];

// Generate a fake timestamp starting from 14:02:33 + index seconds
function fakeTimestamp(index: number): string {
  const base = 14 * 3600 + 2 * 60 + 33 + index;
  const h = Math.floor(base / 3600) % 24;
  const m = Math.floor((base % 3600) / 60);
  const s = base % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function SystemLog({ messages }: SystemLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const language = useLanguageStore((state) => state.language);
  const displayMessages = messages.length === 0 ? BOOT_MESSAGES : messages;
  const logTitle = language === "ko" ? "시스템 이벤트 로그" : "SYSTEM_EVENT_LOG";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-[#0E0E0E] border border-[#3B4B37]/40 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        {/* List icon */}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="0" y="1" width="3" height="1.5" fill="#84967E" />
          <rect x="5" y="1" width="7" height="1.5" fill="#84967E" />
          <rect x="0" y="5" width="3" height="1.5" fill="#84967E" />
          <rect x="5" y="5" width="7" height="1.5" fill="#84967E" />
          <rect x="0" y="9" width="3" height="1.5" fill="#84967E" />
          <rect x="5" y="9" width="7" height="1.5" fill="#84967E" />
        </svg>
        <span className="text-[10px] uppercase tracking-widest text-[#84967E] font-bold">
          {logTitle}
        </span>
      </div>

      {/* Log entries */}
      {/* Mobile: show last 3, Desktop: fixed height scroll */}
      <div
        ref={containerRef}
        className="overflow-y-auto md:h-40 space-y-1"
      >
        <AnimatePresence initial={false}>
          {(messages.length === 0 ? BOOT_MESSAGES : messages).map((msg, i) => (
            <motion.div
              key={messages.length === 0 ? `boot-${i}` : `msg-${i}-${msg.slice(0, 20)}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`flex gap-2 text-[11px] font-mono ${
                messages.length === 0 && i >= displayMessages.length - 3
                  ? ""
                  : messages.length > 0 && i < messages.length - 3
                  ? "md:block hidden"
                  : ""
              }`}
            >
              <span className="text-[#3B4B37] shrink-0 select-none">
                [{fakeTimestamp(i)}]
              </span>
              <span className="text-[#84967E] break-all leading-relaxed">
                {msg}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
