"use client";

import React from "react";
import { motion } from "framer-motion";
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
  handleAnswer: (isCorrect: boolean) => void;
  handleSubQuestionAnswer: (subId: string, optionId: string) => void;
  handleCompleteReading: (question: ReadingQuestion) => void;
  readingSubAnswers: Record<string, string>;
  isReadingQuestionComplete: (question?: QuizQuestion) => boolean;
  goToPrevious: () => void;
  restartQuiz: () => void;
}

export default function QuizLayout({
  quizState,
  timeLeft,
  currentQuestion,
  questions,
  handleAnswer,
  handleSubQuestionAnswer,
  handleCompleteReading,
  readingSubAnswers,
  isReadingQuestionComplete,
}: QuizLayoutProps) {
  const rawProgress =
    ((quizState.current_question_index ?? 0) + 1) / (questions.length || 1);

  const progress = Number.isFinite(rawProgress) ? rawProgress * 100 : 0;

  return (
    <div className="relative h-screen w-screen flex flex-col overflow-hidden text-white">
      {/* Mesh Gradient background (subtle moving) */}
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
        {/* Header - Glassmorphism */}
        <header className="sticky top-0 w-full shrink-0 backdrop-blur-md bg-white/10 border-b border-white/20 px-6 py-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-6">
            <StreakAndRank streak={quizState.streak} />

            <div className="relative">
              <Progress
                value={progress}
                className="w-48 h-3 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-indigo-400 via-purple-400 to-pink-400 shadow-lg [&>div]:shadow-[0_0_20px_rgba(147,51,234,0.6)]"
              />
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 animate-shimmer"
                style={{ width: `${progress}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-black/20 rounded-xl">
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold text-lg">{timeLeft}s</span>
            </div>
            <ScoreBoard score={quizState.score} />
          </div>
        </header>

        {/* Main Vertical Stack Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0">
            <QuestionEngine
              question={currentQuestion}
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

        {/* Footer - Glassmorphism */}
        <footer className="fixed bottom-0 left-0 right-0 shrink-0 backdrop-blur-md bg-white/10/60 border-t border-white/15 py-4 flex justify-center z-50">
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

