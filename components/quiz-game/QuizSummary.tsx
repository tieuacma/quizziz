"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Flame,
  CheckCircle,
  XCircle,
  List,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizState, QuizQuestion } from "@/types/quiz";
import { quizGameCopy } from "./copy";
import FlashcardReview from "./FlashcardReview";
import { useParticleEffect } from "./ParticleSystem";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  delay: number;
}

interface QuizSummaryProps {
  quizState: QuizState;
  incorrectQuestions: QuizQuestion[];
  onPlayAgain: () => void;
  onPracticeWrong: () => void;
  canPractice: boolean;
}

export default function QuizSummary({
  quizState,
  incorrectQuestions,
  onPlayAgain,
  onPracticeWrong,
  canPractice,
}: QuizSummaryProps) {
  const [reviewMode, setReviewMode] = useState<"list" | "flashcard">(
    "flashcard",
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const { triggerEffect } = useParticleEffect();

  const accuracy =
    quizState.correct_count + quizState.wrong_count > 0
      ? Math.round(
          (quizState.correct_count /
            (quizState.correct_count + quizState.wrong_count)) *
            100,
        )
      : 0;

  const isExcellent = accuracy >= 90;
  const isGood = accuracy >= 70;

  // Generate confetti for excellent scores
  const generateConfetti = useCallback(() => {
    if (!isExcellent) return;

    const colors = [
      "#a78bfa",
      "#38bdf8",
      "#e879f9",
      "#fbbf24",
      "#34d399",
      "#f472b6",
      "#60a5fa",
    ];
    const pieces: ConfettiPiece[] = [];

    for (let i = 0; i < 100; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100, // percentage
        y: -10 - Math.random() * 20, // start above viewport
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 3,
        delay: Math.random() * 2,
      });
    }

    setConfettiPieces(pieces);
    setShowConfetti(true);

    // Trigger celebration particles at center
    setTimeout(() => {
      triggerEffect(
        "celebration",
        window.innerWidth / 2,
        window.innerHeight / 3,
      );
    }, 300);
  }, [isExcellent, triggerEffect]);

  useEffect(() => {
    generateConfetti();
  }, [generateConfetti]);

  // Cleanup confetti after animation
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setConfettiPieces([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div className="zenith-immersive relative h-dvh w-full flex flex-col overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 z-0 zenith-grid opacity-35" />

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {confettiPieces.map((piece) => (
              <motion.div
                key={piece.id}
                className="absolute"
                style={{
                  left: `${piece.x}%`,
                  width: piece.size,
                  height: piece.size / 2,
                  backgroundColor: piece.color,
                  borderRadius: 1,
                }}
                initial={{
                  top: `${piece.y}%`,
                  rotate: piece.rotation,
                  opacity: 1,
                }}
                animate={{
                  top: "120%",
                  rotate: piece.rotation + 720,
                  opacity: [1, 1, 0],
                  x: [0, piece.vx * 50, piece.vx * 100],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: piece.delay,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <header className="zenith-glass relative z-10 w-full shrink-0 border-b border-violet-500/15 shadow-[0_1px_15px_rgba(167,139,250,0.15)] py-6 md:py-8 flex flex-col items-center justify-center pt-[max(1.5rem,env(safe-area-inset-top))]">
        <motion.div
          className="zenith-card p-6 text-white rounded-[24px] text-center max-w-md mx-auto relative overflow-hidden hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] transition-all duration-300"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          {/* Glow effect for excellent scores */}
          {isExcellent && (
            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 animate-pulse pointer-events-none" />
          )}

          <motion.div
            animate={
              isExcellent
                ? {
                    rotate: [0, -5, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Trophy
              className="w-16 h-16 mx-auto mb-4 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] relative z-10"
              style={
                isExcellent
                  ? {
                      filter: "drop-shadow(0 0 20px rgba(234,179,8,0.7))",
                    }
                  : undefined
              }
            />
          </motion.div>

          <h1 className="font-display text-3xl md:text-4xl font-extrabold zenith-gradient-text text-neon-glow-violet relative z-10">
            {quizGameCopy.summary.title}
          </h1>

          {/* Achievement badge for excellent scores */}
          {isExcellent && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="mt-2 inline-block px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full text-xs font-black text-slate-900 shadow-[0_0_10px_rgba(234,179,8,0.4)]"
            >
              🌟 XUẤT SẮC! 🌟
            </motion.div>
          )}
          {isGood && !isExcellent && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="mt-2 inline-block px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full text-xs font-black shadow-[0_0_10px_rgba(167,139,250,0.3)]"
            >
              👏 Làm tốt lắm!
            </motion.div>
          )}

          <p className="text-lg opacity-80 mt-2 relative z-10">
            {quizGameCopy.summary.subtitle}
          </p>
        </motion.div>
      </header>

      <main className="relative z-10 flex-1 w-full overflow-y-auto flex flex-col p-6 md:p-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              className="lg:col-span-1 zenith-card rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden animate-float-slow hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] transition-all duration-500"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/15 rounded-full blur-2xl pointer-events-none" />

              {/* Animated score with glow */}
              <motion.div
                className="font-display text-6xl font-extrabold zenith-gradient-text text-neon-glow-violet mb-4 relative"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                style={
                  isExcellent
                    ? {
                        filter:
                          "drop-shadow(0 0 20px rgba(167, 139, 240, 0.6))",
                      }
                    : undefined
                }
              >
                {quizState.score}
              </motion.div>

              <div className="text-xl font-bold text-slate-300 mb-4">
                {quizGameCopy.summary.finalScore}
              </div>

              {/* Accuracy with color coding */}
              <motion.div
                className={`text-5xl font-black mb-2 ${
                  accuracy >= 90
                    ? "text-emerald-400 text-neon-glow-emerald animate-pulse"
                    : accuracy >= 70
                      ? "text-yellow-400 text-neon-glow-yellow animate-pulse"
                      : "text-orange-400 text-neon-glow-rose"
                }`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
              >
                {accuracy}%
              </motion.div>

              <div className="text-lg text-emerald-300/80 font-semibold">
                {quizGameCopy.summary.accuracy}
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="zenith-card rounded-3xl border-2 border-emerald-500/30 bg-emerald-950/20 shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.3)] neon-border-emerald transition-all duration-300 flex items-center">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <CardContent className="p-6 flex items-center gap-4 w-full">
                  <CheckCircle className="w-12 h-12 text-emerald-400 shrink-0 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  <div>
                    <div className="text-4xl font-black text-emerald-400 text-neon-glow-emerald">
                      {quizState.correct_count}
                    </div>
                    <div className="text-lg font-bold text-slate-300">
                      {quizGameCopy.summary.correct}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="zenith-card rounded-3xl border-2 border-rose-500/30 bg-rose-950/20 shadow-[0_0_20px_rgba(244,63,94,0.15)] hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] neon-border-rose transition-all duration-300 flex items-center">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
                <CardContent className="p-6 flex items-center gap-4 w-full">
                  <XCircle className="w-12 h-12 text-red-400 shrink-0 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                  <div>
                    <div className="text-4xl font-black text-red-400 text-neon-glow-rose">
                      {quizState.wrong_count}
                    </div>
                    <div className="text-lg font-bold text-slate-300">
                      {quizGameCopy.summary.wrong}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {incorrectQuestions.length > 0 ? (
            <motion.div
              className="zenith-card rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all duration-300"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row border-b border-white/10 bg-white/[0.02] p-6 justify-between items-center gap-4">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-violet-300 text-neon-glow-violet">
                  <Flame className="w-7 h-7 text-amber-400 animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  {quizGameCopy.summary.reviewTitle(incorrectQuestions.length)}
                </CardTitle>

                {/* Tab selection buttons */}
                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setReviewMode("flashcard")}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      reviewMode === "flashcard"
                        ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/25 neon-border-violet"
                        : "bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    Thẻ 3D Flashcards
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewMode("list")}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      reviewMode === "list"
                        ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/25 neon-border-violet"
                        : "bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <List className="w-4 h-4" />
                    Danh sách câu sai
                  </button>
                </div>
              </div>

              {reviewMode === "flashcard" ? (
                <div className="p-8 bg-black/10">
                  <FlashcardReview questions={incorrectQuestions} />
                </div>
              ) : (
                <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                  {incorrectQuestions.map((q, index) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-violet-500/20 transition-colors flex flex-col gap-1"
                    >
                      <div>
                        <span className="font-extrabold text-red-400 mr-2 text-neon-glow-rose">
                          Q{index + 1}
                        </span>
                        <span className="text-slate-200 font-bold">
                          {q.question}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 italic">
                        {quizGameCopy.summary.reviewHint}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <p className="text-center text-emerald-400 font-bold text-lg text-neon-glow-emerald">
              {quizGameCopy.summary.noWrong}
            </p>
          )}
        </div>
      </main>

      <footer className="zenith-glass relative z-10 mt-auto w-full shrink-0 border-t border-violet-500/15 flex flex-col sm:flex-row items-center justify-center gap-4 p-4 md:p-6 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-1px_15px_rgba(167,139,250,0.15)]">
        <Button
          size="lg"
          className="zenith-btn-glow w-full sm:max-w-xs h-14 text-lg font-extrabold rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-0 shadow-[0_0_20px_rgba(167,139,250,0.35)]"
          disabled={!canPractice}
          onClick={onPracticeWrong}
        >
          {quizGameCopy.summary.practiceWrong}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full sm:max-w-xs h-14 text-lg font-bold rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer"
          onClick={onPlayAgain}
        >
          {quizGameCopy.summary.playAgain}
        </Button>
      </footer>
    </div>
  );
}
