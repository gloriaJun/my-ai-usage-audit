export interface Option {
  text: string;
  score: number; // 0-3, skill level
  tokenImpact: number; // 0-3, efficiency level
  logMessage: string; // terminal log message shown after selection
}

export interface Question {
  id: string;
  category: string;
  scenario: string;
  options: Option[];
  insight: string; // tip shown if user picks suboptimal answer
}

export interface Character {
  id: string;
  name: string;
  rank: "S" | "A" | "B" | "C";
  description: string;
  asciiArt: string;
  colorAccent: string;
  condition: {
    skillMin: number;
    skillMax: number;
    efficiencyMin: number;
    efficiencyMax: number;
  };
}

export interface CategoryTip {
  category: string;
  categoryLabel: string;
  guide: string;
  snippet?: string;
}

export interface QuizState {
  currentStep: number;
  answers: Record<string, number>;
  totalScore: number;
  totalTokenImpact: number;
  categoryScores: Record<string, { score: number; tokenImpact: number }>;
  logMessages: string[];
  character: Character | null;
  selectOption: (
    questionId: string,
    optionIndex: number,
    option: Option
  ) => void;
  nextStep: () => void;
  calculateResult: () => void;
  reset: () => void;
}
