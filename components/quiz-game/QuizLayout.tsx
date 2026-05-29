"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReadingQuestion } from "@/types/quiz";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import StreakAndRank from "./StreakAndRank";
import ScoreBoard from "./ScoreBoard";
import ProgressStats from "./ProgressStats";
import QuestionEngine from "./QuestionEngine";
import type { QuizQuestion, QuizState, PowerUpState, PowerUpType, LeaderboardParticipant, AudioSettingsState } from "@/types/quiz";
import PowerUps from "./PowerUps";
import LiveLeaderboard from "./LiveLeaderboard";

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
  activatePowerUp?: (type: PowerUpType) => void;
  powerups?: PowerUpState;
  leaderboard?: LeaderboardParticipant[];
  audioSettings?: AudioSettingsState;
  toggleAudioSetting?: (setting: "music" | "sfx") => void;
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
  activatePowerUp,
  powerups,
  leaderboard,
  audioSettings,
  toggleAudioSetting,
}: QuizLayoutProps) {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  
  const currentIndex = quizState.current_question_index ?? 0;
  const totalQuestions = questions.length || 1;
  const rawProgress = (currentIndex + 1) / totalQuestions;
  const progress = Number.isFinite(rawProgress) ? rawProgress * 100 : 0;
  const isLowTime = timeLeft <= 10 && timeLeft > 0;
  const timeLimit = currentQuestion?.timeLimit ?? 1;
  const timeRatio = Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100));

  return (
    <div className="relative h-screen w-screen flex flex-col overflow-hidden text-white pb-6">
      {/* Dynamic Animated Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950/80 to-slate-950" />
        <div className="absolute inset-0 opacity-40 blur-3xl">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-500/20 animate-[float1_12s_ease-in-out_infinite]" />
          <div className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-purple-500/20 animate-[float2_14s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-pink-500/15 animate-[float3_16s_ease-in-out_infinite]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.15),transparent_45%)]" />
      </div>

      <div className="relative z-10 h-full w-full flex flex-col justify-between">
        {/* Floating Glassmorphic Header */}
        <header className="mx-4 md:mx-6 mt-4 shrink-0 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 flex items-center justify-between z-50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-4">
            <StreakAndRank streak={quizState.streak} />

            <div className="flex flex-col gap-1 shrink-0">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">
                Câu {currentIndex + 1}/{totalQuestions}
              </span>
              <Progress
                value={progress}
                className="w-24 sm:w-36 h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-indigo-400 [&>div]:to-purple-400 [&>div]:transition-all [&>div]:duration-500"
              />
            </div>
          </div>

          {/* Center controls: Sound and BXH */}
          <div className="flex items-center gap-2">
            {/* Audio settings stub buttons */}
            <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-xl border border-white/5 shrink-0">
              <button
                type="button"
                onClick={() => toggleAudioSetting?.("music")}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  audioSettings?.music
                    ? "bg-white/10 text-indigo-300 border border-white/10 shadow-[0_0_8px_rgba(99,102,241,0.2)]"
                    : "text-slate-500 hover:text-slate-400"
                }`}
                title={audioSettings?.music ? "Nhạc nền: Bật" : "Nhạc nền: Tắt"}
              >
                {audioSettings?.music ? "🎵" : "🔇"}
              </button>
              <button
                type="button"
                onClick={() => toggleAudioSetting?.("sfx")}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  audioSettings?.sfx
                    ? "bg-white/10 text-indigo-300 border border-white/10 shadow-[0_0_8px_rgba(99,102,241,0.2)]"
                    : "text-slate-500 hover:text-slate-400"
                }`}
                title={audioSettings?.sfx ? "Âm thanh: Bật" : "Âm thanh: Tắt"}
              >
                {audioSettings?.sfx ? "⚡" : "🔇"}
              </button>
            </div>

            {/* Simulated Leaderboard Toggle Switch */}
            <button
              type="button"
              onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
              className={`h-9 px-3 flex items-center gap-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer shrink-0 ${
                isLeaderboardOpen
                  ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.25)]"
                  : "bg-white/5 border border-white/10 text-white/70 hover:border-white/20"
              }`}
              title={isLeaderboardOpen ? "Ẩn bảng xếp hạng" : "Hiện bảng xếp hạng"}
            >
              <span>🏆</span>
              <span className="hidden sm:inline">BXH</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 backdrop-blur-sm rounded-xl border transition-colors",
                isLowTime
                  ? "bg-red-500/20 border-red-500/40 animate-pulse"
                  : "bg-black/30 border-white/5",
              )}
            >
              <Clock
                className={cn(
                  "w-4 h-4",
                  isLowTime ? "text-red-400" : "text-indigo-300",
                )}
              />
              <span
                className={cn(
                  "font-mono font-black text-sm tabular-nums",
                  isLowTime ? "text-red-200" : "text-white",
                )}
              >
                {timeLeft}s
              </span>
            </div>
            <ScoreBoard score={quizState.score} />
          </div>
        </header>

        {/* Full-width Question Area with absolute Leaderboard Drawer overlay */}
        <main className="flex-1 flex flex-col justify-center relative min-h-0 w-full max-w-5xl mx-auto px-4 md:px-6 my-6 z-10">
          <div className="flex-1 min-h-0 relative flex flex-col justify-center w-full">
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

          {/* Overlay Live Leaderboard Drawer */}
          <AnimatePresence>
            {isLeaderboardOpen && (
              <motion.div
                initial={{ opacity: 0, x: 120, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 120, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="absolute right-0 top-0 bottom-0 w-80 z-40"
              >
                <LiveLeaderboard leaderboard={leaderboard} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Floating Glassmorphic Footer: Status on left, Power-Ups on right */}
        <footer className="mx-4 md:mx-6 mb-4 shrink-0 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl py-2.5 px-6 flex flex-col sm:flex-row items-center justify-between z-50 gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Consolidated status badges */}
          <div className="flex flex-row items-center gap-3 shrink-0 select-none">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-black shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <span>✅</span>
              <span>{quizState.correct_count}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-black shadow-[0_0_10px_rgba(239,68,68,0.1)]">
              <span>❌</span>
              <span>{quizState.wrong_count}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs font-black shadow-[0_0_12px_rgba(168,85,247,0.12)]">
              <span>🎯</span>
              <span>
                {quizState.correct_count + quizState.wrong_count > 0
                  ? Math.round(
                      (quizState.correct_count /
                        (quizState.correct_count + quizState.wrong_count)) *
                        100,
                    )
                  : 0}
                %
              </span>
            </div>
          </div>

          {/* Compact powerups row */}
          <div className="shrink-0">
            <PowerUps
              powerups={powerups}
              onActivate={activatePowerUp!}
              currentQuestionType={currentQuestion?.type}
              compact
            />
          </div>
        </footer>
      </div>
    </div>
  );
}
