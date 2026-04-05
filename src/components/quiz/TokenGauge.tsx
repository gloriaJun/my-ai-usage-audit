"use client";

import { motion } from "framer-motion";
import { useLanguageStore } from "@/i18n/store";

interface TokenGaugeProps {
  value: number; // 0-21
}

const MAX = 21;
const ARC_LENGTH = 251.2; // half-circle circumference for r=80: Math.PI * 80

function getStatus(value: number): { label: string; color: string } {
  if (value <= 7) return { label: "SAFE", color: "#00FF41" };
  if (value <= 14) return { label: "WARNING", color: "#FDAF00" };
  return { label: "CRITICAL", color: "#FFB4AB" };
}

// Map value (0-21) to needle rotation: -90deg (left/safe) to +90deg (right/critical)
function getNeedleRotation(value: number): number {
  return -90 + (value / MAX) * 180;
}

export default function TokenGauge({ value }: TokenGaugeProps) {
  const language = useLanguageStore((state) => state.language);
  const clampedValue = Math.min(Math.max(value, 0), MAX);
  const status = getStatus(clampedValue);
  const statusLabel =
    language === "ko"
      ? status.label === "SAFE"
        ? "안전"
        : status.label === "WARNING"
        ? "주의"
        : "위험"
      : status.label;
  const progress = clampedValue / MAX;
  const arcFilled = ARC_LENGTH * progress;
  const needleRotation = getNeedleRotation(clampedValue);

  // Gradient stop positions on arc (0-7: green, 8-14: amber, 15-21: red)
  const greenStop = (7 / MAX) * 100;
  const amberStop = (14 / MAX) * 100;

  return (
    <div className="bg-[#1C1B1B] border border-[#3B4B37]/40 p-6">
      {/* Title */}
      <p className="text-[9px] uppercase tracking-widest text-[#84967E] text-center mb-3">
        TOKEN_LEAKAGE_MONITOR
      </p>

      {/* SVG Gauge */}
      <div className="flex justify-center">
        <svg viewBox="0 0 200 120" width="200" height="120" aria-label={`Token leakage: ${clampedValue} — ${status.label}`}>
          <defs>
            {/* Gradient along arc path */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset={`${greenStop}%`} stopColor="#00FF41" />
              <stop offset={`${amberStop}%`} stopColor="#FDAF00" />
              <stop offset="100%" stopColor="#FFB4AB" />
            </linearGradient>
          </defs>

          {/* Background arc (half-circle) */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="20"
            strokeLinecap="butt"
          />

          {/* Filled gradient arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="20"
            strokeLinecap="butt"
            strokeDasharray={`${arcFilled} ${ARC_LENGTH}`}
            strokeDashoffset="0"
          />

          {/* Tick marks */}
          {[0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1].map((t, i) => {
            const angle = -Math.PI + t * Math.PI;
            const cx = 100 + 80 * Math.cos(angle);
            const cy = 100 + 80 * Math.sin(angle);
            const ix = 100 + 68 * Math.cos(angle);
            const iy = 100 + 68 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={ix}
                y1={iy}
                x2={cx}
                y2={cy}
                stroke="#1C1B1B"
                strokeWidth="2"
              />
            );
          })}

          {/* Needle */}
          <motion.g
            style={{ originX: "100px", originY: "100px" }}
            initial={{ rotate: -90 }}
            animate={{ rotate: needleRotation }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.2 }}
          >
            {/* Needle triangle pointing up from center */}
            <polygon
              points="100,25 97,100 103,100"
              fill={status.color}
              opacity={0.9}
            />
          </motion.g>

          {/* Pivot circle */}
          <circle cx="100" cy="100" r="6" fill="#1C1B1B" stroke={status.color} strokeWidth="2" />

          {/* Value text inside arc */}
          <text
            x="100"
            y="93"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fontFamily="monospace"
            fill={status.color}
            letterSpacing="1"
          >
            {String(clampedValue).padStart(2, "0")}
          </text>
        </svg>
      </div>

      {/* Status label */}
      <p
        className="text-center text-sm font-bold tracking-widest uppercase mt-1"
        style={{ color: status.color }}
      >
        {statusLabel}
      </p>

      {/* Stats */}
      <div className="mt-3 flex justify-center gap-6 text-[10px] uppercase tracking-widest text-[#84967E] font-mono">
        <span>KB/s: {(clampedValue * 0.4).toFixed(1)}</span>
        <span>PACKETS: {clampedValue * 195}</span>
      </div>
    </div>
  );
}
