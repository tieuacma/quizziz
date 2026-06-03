"use client";

import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, CheckCircle, XCircle, List, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { QuizState, QuizQuestion } from "@/types/quiz";
import { quizGameCopy } from "./copy";
import FlashcardReview from "./FlashcardReview";

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
  const [reviewMode, setReviewMode] = useState<"list" | "flashcard">("flashcard");
  
  const accuracy =
    quizState.correct_count + quizState.wrong_count > 0
      ? Math.round(
          (quizState.correct_count /
            (quizState.correct_count + quizState.wrong_count)) *
            100,
        )
      : 0;

  return (
    <div className="relative h-dvh w-full flex flex-col overflow-hidden text-white">
      {/* Cosmic Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950/80 to-slate-950" />
        <div className="absolute inset-0 opacity-40 blur-3xl">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-500/20 animate-[float1_12s_ease-in-out_infinite]" />
          <div className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-purple-500/20 animate-[float2_14s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-pink-500/15 animate-[float3_16s_ease-in-out_infinite]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.15),transparent_45%)]" />
      </div>

      <header className="relative z-10 w-full shrink-0 border-b border-white/10 bg-black/40 py-6 md:py-8 backdrop-blur-xl flex flex-col items-center justify-center pt-[max(1.5rem,env(safe-area-inset-top))]">
        <motion.div
          className="p-6 bg-white/[0.02] border border-white/10 backdrop-blur-xl text-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_30px_rgba(99,102,241,0.1)] text-center max-w-md mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            {quizGameCopy.summary.title}
          </h1>
          <p className="text-lg opacity-80 mt-1">
            {quizGameCopy.summary.subtitle}
          </p>
        </motion.div>
      </header>

      <main className="relative z-10 flex-1 w-full overflow-y-auto flex flex-col p-6 md:p-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              className="lg:col-span-1 bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center relative overflow-hidden"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="text-6xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                {quizState.score}
              </div>
              <div className="text-xl font-bold text-slate-300 mb-4">
                {quizGameCopy.summary.finalScore}
              </div>
              <div className="text-5xl font-black text-emerald-400 mb-2 drop-shadow-[0_0_12px_rgba(52,211,153,0.2)]">
                {accuracy}%
              </div>
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
              <Card className="border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <CardContent className="p-6 flex items-center gap-4">
                  <CheckCircle className="w-12 h-12 text-emerald-400 shrink-0 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" />
                  <div>
                    <div className="text-4xl font-black text-emerald-400">
                      {quizState.correct_count}
                    </div>
                    <div className="text-lg font-bold text-slate-300">
                      {quizGameCopy.summary.correct}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
                <CardContent className="p-6 flex items-center gap-4">
                  <XCircle className="w-12 h-12 text-red-400 shrink-0 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]" />
                  <div>
                    <div className="text-4xl font-black text-red-400">
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
              className="bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row border-b border-white/10 bg-white/[0.02] p-6 justify-between items-center gap-4">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-indigo-300">
                  <Flame className="w-7 h-7 text-amber-400 animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                  {quizGameCopy.summary.reviewTitle(incorrectQuestions.length)}
                </CardTitle>

                {/* Tab selection buttons */}
                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setReviewMode("flashcard")}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      reviewMode === "flashcard"
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/25"
                        : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white"
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
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/25"
                        : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white"
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
                      className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-1"
                    >
                      <div>
                        <span className="font-extrabold text-red-400 mr-2">
                          Q{index + 1}
                        </span>
                        <span className="text-slate-200 font-bold">{q.question}</span>
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
            <p className="text-center text-emerald-400 font-bold text-lg drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]">
              {quizGameCopy.summary.noWrong}
            </p>
          )}
        </div>
      </main>

      <footer className="relative z-10 mt-auto w-full shrink-0 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row items-center justify-center gap-4 p-4 md:p-6 backdrop-blur-xl pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          size="lg"
          className="w-full sm:max-w-xs h-14 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-[0_4px_24px_rgba(99,102,241,0.2)]"
          disabled={!canPractice}
          onClick={onPracticeWrong}
        >
          {quizGameCopy.summary.practiceWrong}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full sm:max-w-xs h-14 text-lg font-bold rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
          onClick={onPlayAgain}
        >
          {quizGameCopy.summary.playAgain}
        </Button>
      </footer>
    </div>
  );
}
