"use client";

import { useState } from "react";
import { Character } from "@/types";
import { useLanguageStore } from "@/i18n/store";
import { t } from "@/i18n/messages";
import { getCharacterDescription } from "@/data/characters";

interface ActionBarProps {
  onRetry: () => void;
  character: Character;
  categoryScores: Record<string, { score: number; tokenImpact: number }>;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function generateCard(
  character: Character,
  categoryScores: Record<string, { score: number; tokenImpact: number }>,
  categoryLabels: Record<string, string>,
  description: string
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(null);
      return;
    }

    // Background
    ctx.fillStyle = "#0E0E0E";
    ctx.fillRect(0, 0, 600, 400);

    // Border
    ctx.strokeStyle = "#3B4B37";
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 596, 396);

    // Decorative corner lines
    const corners = [
      [10, 10, 40, 10, 10, 40],
      [590, 10, 560, 10, 590, 40],
      [10, 390, 40, 390, 10, 360],
      [590, 390, 560, 390, 590, 360],
    ];
    ctx.strokeStyle = "#00FF41";
    ctx.lineWidth = 1.5;
    corners.forEach(([x1, y1, x2, y2, x3, y3]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x3, y3);
      ctx.stroke();
    });

    // Header label
    ctx.fillStyle = "#3B4B37";
    ctx.font = "bold 9px monospace";
    ctx.letterSpacing = "4px";
    ctx.fillText("MY-AI-USAGE-AUDIT // RESULT", 30, 35);

    // Character name
    ctx.fillStyle = character.colorAccent;
    ctx.shadowColor = character.colorAccent;
    ctx.shadowBlur = 12;
    ctx.font = "bold 32px monospace";
    ctx.letterSpacing = "2px";
    ctx.fillText(character.name.toUpperCase(), 30, 100);
    ctx.shadowBlur = 0;

    // Rank badge background
    const rankColor =
      character.rank === "S"
        ? "#33FF33"
        : character.rank === "A"
        ? "#33FF33"
        : character.rank === "B"
        ? "#FDAF00"
        : "#FFB4AB";

    ctx.fillStyle = rankColor + "20";
    drawRoundedRect(ctx, 30, 115, 80, 26, 3);
    ctx.fill();
    ctx.strokeStyle = rankColor;
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 30, 115, 80, 26, 3);
    ctx.stroke();

    ctx.fillStyle = rankColor;
    ctx.shadowColor = rankColor;
    ctx.shadowBlur = 6;
    ctx.font = "bold 11px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText(`${character.rank}-RANK`, 42, 133);
    ctx.shadowBlur = 0;

    // Description
    ctx.fillStyle = "#84967E";
    ctx.font = "13px monospace";
    ctx.letterSpacing = "0px";
    ctx.fillText(description, 30, 168);

    // Divider
    ctx.strokeStyle = "#3B4B37";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(30, 190);
    ctx.lineTo(570, 190);
    ctx.stroke();
    ctx.setLineDash([]);

    // Score summary label
    ctx.fillStyle = "#3B4B37";
    ctx.font = "bold 9px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("CATEGORY SCORES", 30, 215);

    // Category scores
    const categories = [
      [categoryLabels.session, "session"],
      [categoryLabels.prompt, "prompt"],
      [categoryLabels.error, "error"],
      [categoryLabels["code-review"], "code-review"],
      [categoryLabels.memory, "memory"],
      [categoryLabels.tool, "tool"],
      [categoryLabels.workflow, "workflow"],
    ];

    const cols = 3;
    const colWidth = 180;
    const rowHeight = 32;

    categories.forEach(([label, key], idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 30 + col * colWidth;
      const y = 228 + row * rowHeight;
      const score = categoryScores[key]?.score ?? 0;

      ctx.fillStyle = "#84967E";
      ctx.font = "10px monospace";
      ctx.letterSpacing = "0px";
      ctx.fillText(label, x, y);

      // Score pip bars
      for (let p = 0; p < 3; p++) {
        ctx.fillStyle = p < score ? "#33FF33" : "#3B4B37";
        ctx.fillRect(x + 70 + p * 14, y - 10, 10, 8);
      }

      ctx.fillStyle = "#33FF33";
      ctx.font = "bold 10px monospace";
      ctx.fillText(`${score}/3`, x + 120, y);
    });

    // Footer
    ctx.fillStyle = "#3B4B37";
    ctx.font = "9px monospace";
    ctx.letterSpacing = "2px";
    ctx.fillText("my-ai-usage-audit.vercel.app", 30, 385);

    ctx.fillStyle = "#00FF41";
    ctx.shadowColor = "#00FF41";
    ctx.shadowBlur = 4;
    ctx.fillText("AUDIT_COMPLETE", 430, 385);
    ctx.shadowBlur = 0;

    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export default function ActionBar({
  onRetry,
  character,
  categoryScores,
}: ActionBarProps) {
  const language = useLanguageStore((state) => state.language);
  const msg = t(language);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared">("idle");
  const [exportStatus, setExportStatus] = useState<"idle" | "generating">("idle");

  const handleExport = async () => {
    if (exportStatus === "generating") return;
    setExportStatus("generating");
    try {
      const blob = await generateCard(
        character,
        categoryScores,
        msg.categoryLabels,
        getCharacterDescription(character.id, language) || character.description
      );
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-audit-${character.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportStatus("idle");
    }
  };

  const handleShare = async () => {
    const text = msg.shareText(character.name, character.rank);
    const url = typeof window !== "undefined" ? window.location.origin : "";

    if (navigator.share) {
      try {
        await navigator.share({ title: "My AI Usage Audit", text, url });
        setShareStatus("shared");
      } catch {
        // User cancelled or error — fallback to clipboard
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShareStatus("copied");
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setShareStatus("copied");
    }

    setTimeout(() => setShareStatus("idle"), 2000);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      {/* EXPORT_CARD */}
      <button
        onClick={handleExport}
        disabled={exportStatus === "generating"}
        className="flex-1 bg-[#2A2A2A] border border-[#3B4B37]/30 text-[#E5E2E1] text-xs font-bold tracking-widest uppercase py-3 px-4 transition-all duration-200 hover:border-[#84967E]/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exportStatus === "generating" ? msg.generating : msg.exportCard}
      </button>

      {/* SHARE_RESULT */}
      <button
        onClick={handleShare}
        className="flex-1 text-xs font-bold tracking-widest uppercase py-3 px-4 transition-all duration-200"
        style={{
          backgroundColor:
            shareStatus !== "idle" ? "#00CC33" : "#00FF41",
          color: "#131313",
          boxShadow: shareStatus !== "idle" ? "0 0 12px #00FF4160" : undefined,
        }}
      >
        {shareStatus === "copied"
          ? msg.linkCopied
          : shareStatus === "shared"
          ? msg.shared
          : msg.shareResult}
      </button>

      {/* RETRY_AUDIT */}
      <button
        onClick={onRetry}
        className="flex-1 border border-[#00FF41] text-[#00FF41] text-xs font-bold tracking-widest uppercase py-3 px-4 transition-all duration-200 hover:bg-[#00FF41] hover:text-[#131313]"
      >
        {msg.retryAudit}
      </button>
    </div>
  );
}
