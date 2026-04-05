import { Language, Question } from "@/types";
import { questionsKo } from "@/data/questions.ko";
import { questionsEn } from "@/data/questions.en";

const QUESTION_MAP: Record<Language, Question[]> = {
  ko: questionsKo,
  en: questionsEn,
};

export function getQuestions(language: Language): Question[] {
  return QUESTION_MAP[language];
}
