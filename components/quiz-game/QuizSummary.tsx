"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { QuizState, QuizQuestion } from "@/types/quiz";
import { quizGameCopy } from "./copy";

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
  const accuracy =
    quizState.correct_count + quizState.wrong_count > 0
      ? Math.round(
          (quizState.correct_count /
            (quizState.correct_count + quizState.wrong_count)) *
            100,
        )
      : 0;

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 overflow-hidden">
      <header className="w-full shrink-0 bg-white/90 backdrop-blur-md shadow-sm flex flex-col items-center justify-center z-10 border-b border-emerald-100 py-8">
        <motion.div
          className="p-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-3xl shadow-2xl text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-black">
            {quizGameCopy.summary.title}
          </h1>
          <p className="text-lg opacity-90 mt-1">
            {quizGameCopy.summary.subtitle}
          </p>
        </motion.div>
      </header>

      <main className="flex-1 w-full overflow-y-auto flex flex-col p-6 md:p-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-emerald-200 flex flex-col items-center text-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="text-6xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
                {quizState.score}
              </div>
              <div className="text-xl font-bold text-gray-900 mb-4">
                {quizGameCopy.summary.finalScore}
              </div>
              <div className="text-5xl font-black text-emerald-600 mb-2">
                {accuracy}%
              </div>
              <div className="text-lg text-emerald-700 font-semibold">
                {quizGameCopy.summary.accuracy}
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-emerald-200 bg-white/80">
                <CardContent className="p-6 flex items-center gap-4">
                  <CheckCircle className="w-12 h-12 text-emerald-500 shrink-0" />
                  <div>
                    <div className="text-4xl font-black text-emerald-600">
                      {quizState.correct_count}
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {quizGameCopy.summary.correct}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-red-200 bg-white/80">
                <CardContent className="p-6 flex items-center gap-4">
                  <XCircle className="w-12 h-12 text-red-500 shrink-0" />
                  <div>
                    <div className="text-4xl font-black text-red-600">
                      {quizState.wrong_count}
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {quizGameCopy.summary.wrong}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {incorrectQuestions.length > 0 ? (
            <motion.div
              className="bg-white/90 rounded-2xl shadow-lg border border-yellow-200 overflow-hidden"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 border-b border-yellow-200 bg-yellow-500/10">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-yellow-800">
                  <Flame className="w-8 h-8" />
                  {quizGameCopy.summary.reviewTitle(incorrectQuestions.length)}
                </CardTitle>
              </div>
              <div className="p-6 space-y-3 max-h-64 overflow-y-auto">
                {incorrectQuestions.map((q, index) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-yellow-50 border border-yellow-200"
                  >
                    <span className="font-bold text-yellow-700 mr-2">
                      Q{index + 1}
                    </span>
                    <span className="text-gray-900">{q.question}</span>
                    <p className="text-sm text-yellow-700 mt-2">
                      {quizGameCopy.summary.reviewHint}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <p className="text-center text-emerald-700 font-medium">
              {quizGameCopy.summary.noWrong}
            </p>
          )}
        </div>
      </main>

      <footer className="w-full shrink-0 bg-white/90 backdrop-blur-md shadow-lg border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-4 p-6 z-10">
        <Button
          size="lg"
          className="w-full sm:max-w-xs h-14 text-lg font-bold"
          disabled={!canPractice}
          onClick={onPracticeWrong}
        >
          {quizGameCopy.summary.practiceWrong}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full sm:max-w-xs h-14 text-lg font-bold"
          onClick={onPlayAgain}
        >
          {quizGameCopy.summary.playAgain}
        </Button>
      </footer>
    </div>
  );
}
