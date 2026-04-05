import { create } from "zustand";
import { QuizState, Option } from "@/types";
import { questions } from "@/data/questions";
import { determineCharacter } from "@/lib/scoring";

export const useQuizStore = create<QuizState>((set, get) => ({
  currentStep: 0,
  answers: {},
  totalScore: 0,
  totalTokenImpact: 0,
  categoryScores: {},
  logMessages: [],
  character: null,

  selectOption: (questionId: string, optionIndex: number, option: Option) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionIndex },
      totalScore: state.totalScore + option.score,
      totalTokenImpact: state.totalTokenImpact + option.tokenImpact,
      categoryScores: {
        ...state.categoryScores,
        [question.category]: {
          score:
            (state.categoryScores[question.category]?.score ?? 0) +
            option.score,
          tokenImpact:
            (state.categoryScores[question.category]?.tokenImpact ?? 0) +
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
