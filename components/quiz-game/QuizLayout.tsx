"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReadingQuestion } from "@/types/quiz";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import StreakAndRank from "./StreakAndRank";
import ScoreBoard from "./ScoreBoard";
import QuestionEngine from "./QuestionEngine";
import type {
  QuizQuestion,
  QuizState,
  PowerUpState,
  PowerUpType,
  LeaderboardParticipant,
  AudioSettingsState,
} from "@/types/quiz";
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

  return (
    <div className="zenith-immersive relative h-dvh w-full flex flex-col overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 z-0 zenith-starfield" />
      <div className="pointer-events-none absolute inset-0 z-0 zenith-grid opacity-35" />
      <div className="pointer-events-none absolute inset-0 z-0 zenith-scanlines" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50 blur-3xl">
        <div className="zenith-nebula-drift zenith-nebula-pulse" />
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-violet-600/15 animate-[float1_12s_ease-in-out_infinite] zenith-nebula-pulse" />
        <div className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-fuchsia-600/10 animate-[float2_14s_ease-in-out_infinite] zenith-nebula-pulse" />
        <div className="absolute bottom-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-cyan-600/10 animate-[float3_16s_ease-in-out_infinite] zenith-nebula-pulse" />
      </div>

      <div className="relative z-10 flex h-full min-h-0 w-full flex-col">
        <header className="zenith-glass w-full shrink-0 border-b border-violet-500/15 shadow-[0_1px_15px_rgba(167,139,250,0.15)] px-4 py-2.5 md:px-6 md:py-3 flex items-center justify-between z-50 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-4">
            <StreakAndRank streak={quizState.streak} />

            <div className="flex flex-col gap-1 shrink-0">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">
                Câu {currentIndex + 1}/{totalQuestions}
              </span>
              <Progress
                value={progress}
                className="w-24 sm:w-36 h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:via-violet-400 [&>div]:to-fuchsia-400 [&>div]:transition-all [&>div]:duration-500 [&>div]:shadow-[0_0_8px_rgba(167,139,250,0.5)]"
              />
            </div>
          </div>

          {/* Center controls: Sound and BXH */}
          <div className="flex items-center gap-2">
            {/* Audio settings stub buttons */}
            <div className="flex items-center gap-1 px-2 py-1 bg-black/40 rounded-xl border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => toggleAudioSetting?.("music")}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  audioSettings?.music
                    ? "bg-cyan-500/10 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(56,189,248,0.3)] neon-border-cyan"
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
                    ? "bg-violet-500/10 text-violet-300 border border-violet-400/40 shadow-[0_0_10px_rgba(167,139,250,0.3)] neon-border-violet"
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
                  ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.3)] neon-border-yellow"
                  : "bg-white/5 border border-white/10 text-white/70 hover:border-white/20"
              }`}
              title={
                isLeaderboardOpen ? "Ẩn bảng xếp hạng" : "Hiện bảng xếp hạng"
              }
            >
              <span>🏆</span>
              <span className="hidden sm:inline">BXH</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <motion.div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 backdrop-blur-sm rounded-xl border transition-all duration-300",
                isLowTime
                  ? "bg-red-500/20 border-red-500/50 neon-border-rose"
                  : "bg-black/30 border-white/5",
              )}
              animate={
                isLowTime
                  ? {
                      boxShadow: [
                        "0 0 10px rgba(244, 63, 94, 0.3)",
                        "0 0 25px rgba(244, 63, 94, 0.7)",
                        "0 0 10px rgba(244, 63, 94, 0.3)",
                      ],
                      scale: [1, 1.06, 1],
                    }
                  : {}
              }
              transition={
                isLowTime
                  ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                  : {}
              }
            >
              <Clock
                className={cn(
                  "w-4 h-4",
                  isLowTime
                    ? "text-red-400 animate-pulse drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]"
                    : "text-violet-300",
                )}
              />
              <span
                className={cn(
                  "font-mono font-black text-sm tabular-nums",
                  isLowTime ? "text-red-200 text-neon-glow-rose" : "text-white",
                )}
              >
                {timeLeft}s
              </span>
            </motion.div>
            <ScoreBoard score={quizState.score} />
          </div>
        </header>

        {/* Full-width Question Area with absolute Leaderboard Drawer overlay */}
        <main className="flex-1 flex flex-col justify-center relative min-h-0 w-full mx-auto px-4 md:px-6 py-2 md:py-4 z-10 overflow-hidden">
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
              <>
                {/* Backdrop to prevent layout/scroll glitches */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute inset-0 z-30 bg-black/30 backdrop-blur-[2px]"
                />
                <motion.div
                  initial={{ opacity: 0, x: 120, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 120, scale: 0.97 }}
                  transition={{ type: "spring", damping: 28, stiffness: 240 }}
                  style={{ transformOrigin: "right center" }}
                  className="absolute right-0 top-0 bottom-0 w-80 z-40"
                >
                  <LiveLeaderboard leaderboard={leaderboard} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </main>

        {/* Docked footer: status + power-ups */}
        <footer className="zenith-glass mt-auto w-full shrink-0 border-t border-violet-500/15 shadow-[0_-1px_15px_rgba(167,139,250,0.15)] px-4 py-2 md:px-6 md:py-3 flex flex-col sm:flex-row items-center justify-between z-50 gap-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {/* Consolidated status badges */}
          <div className="flex flex-row items-center gap-3 shrink-0 select-none">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-300 text-xs font-black shadow-[0_0_15px_rgba(52,211,153,0.35)] neon-border-emerald">
              <span>✅</span>
              <span>{quizState.correct_count}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-300 text-xs font-black shadow-[0_0_15px_rgba(244,63,94,0.35)] neon-border-rose">
              <span>❌</span>
              <span>{quizState.wrong_count}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/15 border-2 border-violet-500/40 text-violet-200 text-xs font-black shadow-[0_0_15px_rgba(167,139,250,0.35)] neon-border-violet">
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
