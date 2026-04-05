"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useLanguageStore } from "@/i18n/store";
import { t } from "@/i18n/messages";

interface RadarChartProps {
  categoryScores: Record<string, { score: number; tokenImpact: number }>;
}

const CATEGORIES = [
  "session",
  "prompt",
  "error",
  "code-review",
  "memory",
  "tool",
  "workflow",
];

const MAX_RADIUS = 100;
const CENTER_X = 150;
const CENTER_Y = 150;
const MAX_SCORE = 3;

const angles = Array.from(
  { length: 7 },
  (_, i) => (Math.PI * 2 * i) / 7 - Math.PI / 2
);

function getPoint(angle: number, radius: number) {
  return {
    x: CENTER_X + radius * Math.cos(angle),
    y: CENTER_Y + radius * Math.sin(angle),
  };
}

function pointsToPath(points: { x: number; y: number }[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
}

function HeptagonGrid({ fraction }: { fraction: number }) {
  const pts = angles.map((a) => getPoint(a, MAX_RADIUS * fraction));
  return (
    <polygon
      points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
      fill="none"
      stroke="#3B4B37"
      strokeWidth="1"
      opacity="0.5"
    />
  );
}

export default function RadarChart({ categoryScores }: RadarChartProps) {
  const language = useLanguageStore((state) => state.language);
  const msg = t(language);
  const labels = CATEGORIES.map((cat) => msg.categoryLabels[cat as keyof typeof msg.categoryLabels]);

  const dataPoints = useMemo(() => {
    return CATEGORIES.map((cat, i) => {
      const score = categoryScores[cat]?.score ?? 0;
      const ratio = Math.min(score / MAX_SCORE, 1);
      const radius = ratio * MAX_RADIUS;
      return getPoint(angles[i], radius);
    });
  }, [categoryScores]);

  const dataPath = pointsToPath(dataPoints);

  return (
    <div className="bg-[#0E0E0E] border border-[#3B4B37]/15 p-6">
      <p className="text-[9px] uppercase tracking-widest text-[#84967E] mb-4">
        {msg.capabilityRadar}
      </p>
      <div className="flex justify-center">
        <svg
          viewBox="0 0 300 300"
          width="100%"
          style={{ maxWidth: 320 }}
          aria-label="Radar chart of category scores"
        >
          {/* Grid heptagons */}
          <HeptagonGrid fraction={0.33} />
          <HeptagonGrid fraction={0.66} />
          <HeptagonGrid fraction={1.0} />

          {/* Axis lines from center to each vertex */}
          {angles.map((angle, i) => {
            const tip = getPoint(angle, MAX_RADIUS);
            return (
              <line
                key={i}
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={tip.x}
                y2={tip.y}
                stroke="#3B4B37"
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}

          {/* Data polygon fill — animated opacity */}
          <motion.path
            d={dataPath}
            fill="rgba(51, 255, 51, 0.15)"
            stroke="none"
            initial={{ fillOpacity: 0 }}
            animate={{ fillOpacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          />

          {/* Data polygon stroke — draw-in animation */}
          <motion.path
            d={dataPath}
            fill="none"
            stroke="#33FF33"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Data point circles */}
          {dataPoints.map((pt, i) => (
            <motion.circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill="#33FF33"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.9 + i * 0.06 }}
              style={{ filter: "drop-shadow(0 0 3px #33FF33)" }}
            />
          ))}

          {/* Axis labels */}
          {angles.map((angle, i) => {
            const labelRadius = MAX_RADIUS + 18;
            const pt = getPoint(angle, labelRadius);

            // Horizontal alignment
            let textAnchor: "start" | "middle" | "end" = "middle";
            if (pt.x < CENTER_X - 10) textAnchor = "end";
            else if (pt.x > CENTER_X + 10) textAnchor = "start";

            return (
              <text
                key={i}
                x={pt.x}
                y={pt.y + 4}
                textAnchor={textAnchor}
                fill="#33FF33"
                fontSize="10"
                fontFamily="monospace"
                opacity="0.8"
              >
                {labels[i]}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Score legend */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {CATEGORIES.map((cat, i) => {
          const score = categoryScores[cat]?.score ?? 0;
          return (
            <div key={cat} className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#33FF33", boxShadow: "0 0 3px #33FF33" }}
              />
              <span className="text-[9px] uppercase tracking-wider text-[#84967E]">
                {labels[i]}
              </span>
              <span className="text-[9px] text-[#33FF33] ml-auto">{score}/3</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
