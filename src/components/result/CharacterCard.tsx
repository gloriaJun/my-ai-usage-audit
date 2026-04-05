"use client";

import { Character } from "@/types";
import { categoryTips } from "@/data/characters";

interface CharacterCardProps {
  character: Character;
  strongCategories: string[];
  weakCategories: string[];
}

function getRankStyles(rank: string): {
  color: string;
  glowClass: string;
  label: string;
} {
  switch (rank) {
    case "S":
      return {
        color: "#33FF33",
        glowClass: "glow-text",
        label: "S-RANK",
      };
    case "A":
      return {
        color: "#33FF33",
        glowClass: "",
        label: "A-RANK",
      };
    case "B":
      return {
        color: "#FDAF00",
        glowClass: "glow-text-amber",
        label: "B-RANK",
      };
    case "C":
      return {
        color: "#FFB4AB",
        glowClass: "glow-text-error",
        label: "C-RANK",
      };
    default:
      return {
        color: "#33FF33",
        glowClass: "",
        label: `${rank}-RANK`,
      };
  }
}

export default function CharacterCard({
  character,
  strongCategories,
  weakCategories,
}: CharacterCardProps) {
  const rankStyles = getRankStyles(character.rank);
  const topStrong = strongCategories.slice(0, 2);
  const topWeak = weakCategories.slice(0, 2);

  return (
    <div className="relative bg-[#0E0E0E] border-2 border-[#3B4B37]/20 p-8 overflow-hidden">
      {/* Data pulse animation overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,255,65,0.02) 50%, transparent 100%)",
          animation: "pulse 3s ease-in-out infinite",
        }}
      />

      {/* ASCII Art */}
      <pre
        className="font-mono text-xs leading-tight mb-6 glow-text overflow-x-auto"
        style={{
          color: character.colorAccent,
          textShadow: `0 0 8px ${character.colorAccent}60`,
        }}
      >
        {character.asciiArt}
      </pre>

      {/* Character Name */}
      <h2
        className="text-3xl font-bold tracking-widest uppercase mb-3"
        style={{
          color: character.colorAccent,
          textShadow: `0 0 12px ${character.colorAccent}80`,
        }}
      >
        {character.name}
      </h2>

      {/* Rank Badge */}
      <div className="inline-flex items-center mb-4">
        <div
          className="relative px-4 py-1.5 border-2 text-xs font-bold tracking-widest uppercase"
          style={{
            borderColor: rankStyles.color,
            color: rankStyles.color,
            boxShadow: `0 0 8px ${rankStyles.color}40, inset 0 0 8px ${rankStyles.color}10`,
          }}
        >
          {/* Corner dots */}
          <span
            className="absolute top-[-4px] left-[-4px] w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: rankStyles.color }}
          />
          <span
            className="absolute top-[-4px] right-[-4px] w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: rankStyles.color }}
          />
          <span
            className="absolute bottom-[-4px] left-[-4px] w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: rankStyles.color }}
          />
          <span
            className="absolute bottom-[-4px] right-[-4px] w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: rankStyles.color }}
          />
          {rankStyles.label}
        </div>
      </div>

      {/* Description */}
      <p className="text-[#84967E] text-sm leading-relaxed mb-6">
        {character.description}
      </p>

      {/* Strengths & Weaknesses */}
      <div className="space-y-4">
        {topStrong.length > 0 && (
          <div>
            <p className="text-[9px] uppercase tracking-widest text-[#84967E] mb-2">
              STRENGTHS
            </p>
            <ul className="space-y-1">
              {topStrong.map((cat) => (
                <li key={cat} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: "#00FF41",
                      boxShadow: "0 0 4px #00FF41",
                    }}
                  />
                  <span className="text-[#E5E2E1]">
                    {categoryTips[cat]?.categoryLabel ?? cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {topWeak.length > 0 && (
          <div>
            <p className="text-[9px] uppercase tracking-widest text-[#84967E] mb-2">
              WEAKNESSES
            </p>
            <ul className="space-y-1">
              {topWeak.map((cat) => (
                <li key={cat} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: "#FFB4AB",
                      boxShadow: "0 0 4px #FFB4AB",
                    }}
                  />
                  <span className="text-[#E5E2E1]">
                    {categoryTips[cat]?.categoryLabel ?? cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
