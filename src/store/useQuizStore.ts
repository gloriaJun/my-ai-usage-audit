import { create } from "zustand";
import { QuizState, Option } from "@/types";
import { determineCharacter } from "@/lib/scoring";

export const useQuizStore = create<QuizState>((set, get) => ({
  currentStep: 0,
  answers: {},
  totalScore: 0,
  totalTokenImpact: 0,
  categoryScores: {},
  logMessages: [],
  character: null,

  selectOption: (
    questionId: string,
    category: string,
    optionIndex: number,
    option: Option
  ) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionIndex },
      totalScore: state.totalScore + option.score,
      totalTokenImpact: state.totalTokenImpact + option.tokenImpact,
      categoryScores: {
        ...state.categoryScores,
        [category]: {
          score:
            (state.categoryScores[category]?.score ?? 0) +
            option.score,
          tokenImpact:
            (state.categoryScores[category]?.tokenImpact ?? 0) +
            option.tokenImpact,
        },
      },
      logMessages: [...state.logMessages, option.logMessage],
    }));
  },

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

  calculateResult: () => {
    const { totalScore, totalTokenImpact } = get();
    const character = determineCharacter(totalScore, totalTokenImpact);
    set({ character });
  },

  reset: () =>
    set({
      currentStep: 0,
      answers: {},
      totalScore: 0,
      totalTokenImpact: 0,
      categoryScores: {},
      logMessages: [],
      character: null,
    }),
}));
