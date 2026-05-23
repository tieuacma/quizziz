"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { ReadingQuestion } from "@/types/quiz";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import StreakAndRank from "./StreakAndRank";
import ScoreBoard from "./ScoreBoard";
import ProgressStats from "./ProgressStats";
import QuestionEngine from "./QuestionEngine";
import type { QuizQuestion, QuizState } from "@/types/quiz";

interface QuizLayoutProps {
  quizState: QuizState;
  timeLeft: number;
  currentQuestion: QuizQuestion | undefined;
  questions: QuizQuestion[];
  questionKey: string;
  handleAnswer: (isCorrect: boolean) => void;
  handleSubQuestionAnswer: (subId: string, answer: string) => void;
  handleCompleteReading: (question: ReadingQuestion) => void;
  readingSubAnswers: Record<string, string>;
  isReadingQuestionComplete: (question?: QuizQuestion) => boolean;
}

export default function QuizLayout({
  quizState,
  timeLeft,
  currentQuestion,
  questions,
  questionKey,
  handleAnswer,
  handleSubQuestionAnswer,
  handleCompleteReading,
  readingSubAnswers,
  isReadingQuestionComplete,
}: QuizLayoutProps) {
  const currentIndex = quizState.current_question_index ?? 0;
  const totalQuestions = questions.length || 1;
  const rawProgress = (currentIndex + 1) / totalQuestions;
  const progress = Number.isFinite(rawProgress) ? rawProgress * 100 : 0;
  const isLowTime = timeLeft <= 10 && timeLeft > 0;
  const timeLimit = currentQuestion?.timeLimit ?? 1;
  const timeRatio = Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100));

  return (
    <div className="relative h-screen w-screen flex flex-col overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900/70 to-pink-900/60" />
        <div className="absolute inset-0 opacity-80 blur-3xl">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-r from-indigo-500/40 via-purple-500/30 to-pink-500/30 animate-[float1_10s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-gradient-to-r from-purple-500/35 via-pink-500/25 to-indigo-500/25 animate-[float2_12s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-pink-500/25 via-indigo-500/25 to-emerald-500/20 animate-[float3_14s_ease-in-out_infinite]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(147,51,234,0.35),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.25),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.18),transparent_50%)]" />
      </div>

      <div className="relative z-10 h-full w-full flex flex-col">
        <header className="sticky top-0 w-full shrink-0 backdrop-blur-md bg-white/10 border-b border-white/20 px-6 py-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-4 md:gap-6">
            <StreakAndRank streak={quizState.streak} />

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-white/70 uppercase tracking-wide">
                Câu {currentIndex + 1}/{totalQuestions}
              </span>
              <Progress
                value={progress}
                className="w-40 md:w-48 h-3 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-indigo-400 [&>div]:via-purple-400 [&>div]:to-pink-400 [&>div]:transition-all [&>div]:duration-500 [&>div]:shadow-[0_0_16px_rgba(147,51,234,0.5)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div
              className={cn(
                "flex flex-col gap-1 px-4 py-2 backdrop-blur-sm rounded-xl border transition-colors",
                isLowTime
                  ? "bg-red-500/25 border-red-400/50 animate-pulse"
                  : "bg-black/20 border-white/10",
              )}
            >
              <div className="flex items-center gap-2">
                <Clock
                  className={cn(
                    "w-5 h-5",
                    isLowTime ? "text-red-300" : "text-white",
                  )}
                />
                <span
                  className={cn(
                    "font-mono font-bold text-lg tabular-nums",
                    isLowTime && "text-red-200",
                  )}
                >
                  {timeLeft}s
                </span>
              </div>
              <Progress
                value={timeRatio}
                className={cn(
                  "w-20 h-1 bg-white/15",
                  isLowTime
                    ? "[&>div]:bg-red-400"
                    : "[&>div]:bg-emerald-400/80",
                )}
              />
            </div>
            <ScoreBoard score={quizState.score} />
          </div>
        </header>

        <main className="flex-1 flex flex-col overflow-hidden min-h-0 pb-24">
          <div className="flex-1 min-h-0">
            <QuestionEngine
              question={currentQuestion}
              questionKey={questionKey}
              quizState={
                quizState as QuizState & { currentSubQuestionIndex: number }
              }
              handleAnswer={handleAnswer}
              handleSubQuestionAnswer={handleSubQuestionAnswer}
              handleCompleteReading={handleCompleteReading}
              readingSubAnswers={readingSubAnswers}
              isReadingQuestionComplete={isReadingQuestionComplete}
            />
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 shrink-0 backdrop-blur-md bg-white/10 border-t border-white/15 py-4 flex justify-center z-50">
          <div className="w-full max-w-5xl flex items-center justify-center px-6">
            <ProgressStats
              correctCount={quizState.correct_count}
              wrongCount={quizState.wrong_count}
            />
          </div>
        </footer>
      </div>
    </div>
  );
}
