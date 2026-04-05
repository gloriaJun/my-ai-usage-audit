"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Option } from "@/types";

interface OptionButtonsProps {
  options: Option[];
  onSelect: (index: number) => void;
  disabled: boolean;
}

export default function OptionButtons({ options, onSelect, disabled }: OptionButtonsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function handleClick(index: number) {
    if (disabled || selectedIndex !== null) return;

    setSelectedIndex(index);

    // After flash animation, call onSelect
    setTimeout(() => {
      onSelect(index);
    }, 500);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        const isOther = selectedIndex !== null && !isSelected;

        return (
          <motion.button
            key={index}
            onClick={() => handleClick(index)}
            disabled={disabled || selectedIndex !== null}
            whileHover={
              selectedIndex === null && !disabled
                ? { scale: 1.02 }
                : {}
            }
            animate={
              isSelected
                ? { backgroundColor: "#00FF41", color: "#131313", scale: 1.03 }
                : isOther
                ? { opacity: 0.3, scale: 1 }
                : { backgroundColor: "transparent", color: "#E5E2E1", opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.2 }}
            className="
              relative text-left px-4 py-3
              border border-[#3B4B37]/40
              text-xs font-bold tracking-widest uppercase
              hover:bg-[#00FF41] hover:text-[#131313]
              disabled:cursor-not-allowed
              transition-colors duration-200
              font-mono
            "
          >
            <span className="text-[#00FF41] mr-2 select-none">
              {isSelected ? ">" : ">"}
            </span>
            <span
              style={
                isSelected
                  ? { color: "#131313" }
                  : {}
              }
            >
              {option.text}
            </span>

            {/* Selection flash overlay */}
            {isSelected && (
              <motion.div
                className="absolute inset-0 bg-[#00FF41]"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
