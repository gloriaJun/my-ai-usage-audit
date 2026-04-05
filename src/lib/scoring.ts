import { Character } from "@/types";
import { characters } from "@/data/characters";

export function determineCharacter(
  totalScore: number,
  totalTokenImpact: number
): Character {
  // Check characters in order (Token Alchemist first, Hopeful Beginner last as fallback)
  // Match: skill within [skillMin, skillMax] AND efficiency within [efficiencyMin, efficiencyMax]
  const match = characters.find(
    (c) =>
      totalScore >= c.condition.skillMin &&
      totalScore <= c.condition.skillMax &&
      totalTokenImpact >= c.condition.efficiencyMin &&
      totalTokenImpact <= c.condition.efficiencyMax
  );
  return match || characters[characters.length - 1]; // fallback to last (Hopeful Beginner)
}

export function getWeakCategories(
  categoryScores: Record<string, { score: number; tokenImpact: number }>
): string[] {
  return Object.entries(categoryScores)
    .filter(([, v]) => v.score < 3)
    .sort((a, b) => a[1].score - b[1].score)
    .map(([k]) => k);
}

export function getStrongCategories(
  categoryScores: Record<string, { score: number; tokenImpact: number }>
): string[] {
  return Object.entries(categoryScores)
    .filter(([, v]) => v.score >= 2)
    .sort((a, b) => b[1].score - a[1].score)
    .map(([k]) => k);
}
