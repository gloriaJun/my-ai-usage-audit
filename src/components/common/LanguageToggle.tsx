"use client";

import { useLanguageStore } from "@/i18n/store";
import { Language } from "@/types";

export default function LanguageToggle() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  function handleChange(nextLanguage: Language) {
    if (nextLanguage === language) return;
    setLanguage(nextLanguage);
  }

  return (
    <div className="inline-flex items-center border border-[#3B4B37]/50 bg-[#0E0E0E]">
      <button
        onClick={() => handleChange("ko")}
        className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase transition-colors"
        style={{
          color: language === "ko" ? "#131313" : "#84967E",
          backgroundColor: language === "ko" ? "#00FF41" : "transparent",
        }}
        aria-pressed={language === "ko"}
      >
        KO
      </button>
      <button
        onClick={() => handleChange("en")}
        className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase transition-colors"
        style={{
          color: language === "en" ? "#131313" : "#84967E",
          backgroundColor: language === "en" ? "#00FF41" : "transparent",
        }}
        aria-pressed={language === "en"}
      >
        EN
      </button>
    </div>
  );
}
