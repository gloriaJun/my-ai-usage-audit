"use client";

import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import { getQuestions } from "@/data/questions";
import TopBar from "@/components/TopBar";
import StatusFooter from "@/components/StatusFooter";
import QuizTerminal from "@/components/quiz/QuizTerminal";
import OptionButtons from "@/components/quiz/OptionButtons";
import TokenGauge from "@/components/quiz/TokenGauge";
import SystemLog from "@/components/quiz/SystemLog";
import ProgressBar from "@/components/quiz/ProgressBar";
import { useLanguageStore } from "@/i18n/store";

export default function QuizPage() {
  const router = useRouter();
  const {
    currentStep,
    totalTokenImpact,
    logMessages,
    selectOption,
    nextStep,
    calculateResult,
  } = useQuizStore();
  const language = useLanguageStore((state) => state.language);
  const questions = getQuestions(language);

  const currentQuestion = questions[currentStep];

  function handleOptionSelect(index: number) {
    if (!currentQuestion) return;

    const option = currentQuestion.options[index];

    selectOption(currentQuestion.id, currentQuestion.category, index, option);

    setTimeout(() => {
      nextStep();

      // After nextStep the store updates; check if quiz is complete
      const nextStepValue = currentStep + 1;
      if (nextStepValue >= questions.length) {
        calculateResult();
        router.push("/result");
      }
    }, 800);
  }

  if (!currentQuestion) {
    // Guard: shouldn't normally be visible, but prevents flash
    return null;
  }

  return (
    <div className="min-h-screen bg-[#131313]">
      {/* CRT overlay */}
      <div className="crt-overlay" />

      <TopBar mode="quiz" currentStep={currentStep} />

      {/* Main content */}
      <main className="pt-20 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Mobile: single column stack */}
          <div className="lg:hidden flex flex-col gap-4 mt-4">
            <ProgressBar currentStep={currentStep} totalSteps={questions.length} />
            <TokenGauge value={totalTokenImpact} />
            <QuizTerminal
              key={`mobile-terminal-${currentStep}`}
              scenario={currentQuestion.scenario}
              questionNumber={currentStep + 1}
            />
            <OptionButtons
              key={`mobile-options-${currentStep}`}
              options={currentQuestion.options}
              onSelect={handleOptionSelect}
              disabled={false}
            />
            <SystemLog messages={logMessages} />
          </div>

          {/* Desktop: 2-column grid */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6 mt-4">
            {/* Left: main interaction area */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <QuizTerminal
                key={`desktop-terminal-${currentStep}`}
                scenario={currentQuestion.scenario}
                questionNumber={currentStep + 1}
              />
              <OptionButtons
                key={`desktop-options-${currentStep}`}
                options={currentQuestion.options}
                onSelect={handleOptionSelect}
                disabled={false}
              />
            </div>

            {/* Right: sidebar panels */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <TokenGauge value={totalTokenImpact} />
              <SystemLog messages={logMessages} />
              <ProgressBar currentStep={currentStep} totalSteps={questions.length} />
            </div>
          </div>

        </div>
      </main>

      <StatusFooter />
    </div>
  );
}
