"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuizStore } from "@/store/useQuizStore";
import StatusFooter from "@/components/StatusFooter";
import LanguageToggle from "@/components/common/LanguageToggle";
import { useLanguageStore } from "@/i18n/store";
import { t } from "@/i18n/messages";

const BOOT_LINES = [
  "[ 0.000000] INITIALIZING KERNEL AUDIT VERSION 2.0.4",
  "[ 0.043512] LOADING NEURAL DECODER MODULE...",
  "[ 0.122894] SYSCALL INTERCEPTOR: ACTIVE",
  "[ 0.234001] CONNECTING TO DIAGNOSTIC SERVER...",
  "[ 0.445123] HANDSHAKE VERIFIED: AES-256-GCM",
  "[ 0.678234] AUDIT ENGINE: READY",
  "[ 1.000000] ALL SYSTEMS OPERATIONAL",
];

const BOOT_DELAY_MS = 300;

export default function Home() {
  const router = useRouter();
  const reset = useQuizStore((state) => state.reset);
  const language = useLanguageStore((state) => state.language);
  const msg = t(language);

  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        if (i === BOOT_LINES.length - 1) {
          const done = setTimeout(() => setBooting(false), 500);
          timeouts.push(done);
        }
      }, BOOT_DELAY_MS * (i + 1));
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center px-6 pb-16">
        <div className="fixed top-5 right-6 z-50">
          <LanguageToggle />
        </div>
        {booting ? (
          /* Boot sequence */
          <div className="w-full max-w-2xl font-mono">
            {visibleLines.map((line, i) => (
              <div
                key={i}
                className="text-xs text-[#00FF41]/60 leading-relaxed"
              >
                {line}
              </div>
            ))}
            {/* Blinking cursor */}
            <span className="inline-block w-2 h-3 bg-[#00FF41]/60 animate-pulse ml-0.5" />
          </div>
        ) : (
          /* Main content */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-8 text-center"
          >
            {/* Title */}
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-[#00FF41] glow-text tracking-widest uppercase">
                MY-AI-USAGE-AUDIT
              </h1>
              <p className="mt-3 text-sm md:text-base text-[#84967E] tracking-wide">
                {msg.landingTagline}
              </p>
            </div>

            {/* Description */}
            <p className="max-w-md text-sm text-[#84967E]/80 leading-relaxed">
              {msg.landingDescription}
            </p>

            {/* Start button */}
            <motion.button
              onClick={() => router.push("/quiz")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={[
                "relative border-2 border-[#00FF41] text-[#00FF41]",
                "px-8 py-4 text-lg font-black tracking-widest uppercase",
                "transition-colors duration-200",
                "hover:bg-[#00FF41] hover:text-[#131313]",
                "hover:drop-shadow-[0_0_20px_rgba(0,255,65,0.5)]",
                "btn-pulse-glow",
              ].join(" ")}
            >
              {msg.startAudit}
            </motion.button>

            {/* Footer info */}
            <p className="text-[10px] tracking-widest text-[#84967E]/60 uppercase">
              {msg.footerSummary}
            </p>
          </motion.div>
        )}
      </main>

      <StatusFooter />
    </>
  );
}
