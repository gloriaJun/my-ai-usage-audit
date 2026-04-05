"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { getWeakCategories, getStrongCategories } from "@/lib/scoring";
import TopBar from "@/components/TopBar";
import StatusFooter from "@/components/StatusFooter";
import CharacterCard from "@/components/result/CharacterCard";
import RadarChart from "@/components/result/RadarChart";
import InsightPanel from "@/components/result/InsightPanel";
import ActionBar from "@/components/result/ActionBar";

export default function ResultPage() {
  const router = useRouter();
  const { character, categoryScores, totalTokenImpact, reset } = useQuizStore();

  useEffect(() => {
    if (!character) {
      router.replace("/");
    }
  }, [character, router]);

  if (!character) return null;

  const weakCategories = getWeakCategories(categoryScores);
  const strongCategories = getStrongCategories(categoryScores);

  const tokenRatio = (totalTokenImpact / 21).toFixed(2);

  const handleRetry = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#131313] overflow-x-hidden">
      <TopBar mode="result" onRetry={handleRetry} />

      <main className="pt-20 pb-24 px-4 md:px-8 overflow-y-auto">
        {/* Top section — character card + radar */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-6 mb-6">
          {/* Character Card */}
          <div className="lg:col-span-5 mb-6 lg:mb-0">
            <CharacterCard
              character={character}
              strongCategories={strongCategories}
              weakCategories={weakCategories}
            />
          </div>

          {/* Radar Chart */}
          <div className="lg:col-span-7">
            <RadarChart categoryScores={categoryScores} />
          </div>
        </div>

        {/* Insight Panel — full width */}
        <div className="mb-6">
          <InsightPanel
            weakCategories={weakCategories}
            categoryScores={categoryScores}
          />
        </div>

        {/* System Analysis Log */}
        <div className="bg-[#0E0E0E] border border-[#3B4B37]/15 p-6 mb-6">
          <p className="text-[9px] uppercase tracking-widest text-[#84967E] mb-3">
            SYSTEM_ANALYSIS_STREAM
          </p>
          <div className="space-y-1 font-mono text-xs">
            <div className="flex gap-3">
              <span className="text-[#3B4B37]">0x001</span>
              <span className="text-[#33FF33]">DIAGNOSTIC SEQUENCE COMPLETE</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#3B4B37]">0x002</span>
              <span className="text-[#84967E]">
                TOKEN EFFICIENCY RATIO:{" "}
                <span className="text-[#33FF33]">{tokenRatio}</span>
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#3B4B37]">0x003</span>
              <span className="text-[#84967E]">
                <span
                  style={{
                    color:
                      character.rank === "S"
                        ? "#33FF33"
                        : character.rank === "A"
                        ? "#33FF33"
                        : character.rank === "B"
                        ? "#FDAF00"
                        : "#FFB4AB",
                  }}
                >
                  {character.rank}-RANK
                </span>{" "}
                STATUS CONFIRMED
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#3B4B37]">0x004</span>
              <span className="text-[#84967E]">
                OPERATOR CLEARANCE VALIDATED —{" "}
                <span className="text-[#E5E2E1]">{character.name}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <ActionBar
          onRetry={handleRetry}
          character={character}
          categoryScores={categoryScores}
        />
      </main>

      <StatusFooter />
    </div>
  );
}
