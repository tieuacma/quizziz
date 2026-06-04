"use client";

import React, { useState } from "react";

import { motion } from "framer-motion";
import type { FillInBlankQuestion } from "@/types/quiz";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { gradeFillBlank } from "@/lib/quiz-game/grade";
import { quizGameCopy } from "./copy";
import { QUESTION_FEEDBACK_MS } from "./motion";

interface FillBlankCardProps {
  question: FillInBlankQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export default function FillBlankCard({
  question,
  onAnswer,
}: FillBlankCardProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswer = () => {
    if (submitted) return;

    const match = gradeFillBlank(
      question.answers,
      userAnswer,
      question.caseSensitive,
    );

    setIsCorrect(match);
    setSubmitted(true);
    setTimeout(() => onAnswer(match), QUESTION_FEEDBACK_MS);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 gap-8">
        <motion.h2
          className="font-display text-3xl md:text-5xl font-extrabold text-center leading-tight max-w-4xl zenith-gradient-text-static"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {question.question}
        </motion.h2>

        <div className="w-full max-w-2xl relative">
          <Input
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
            placeholder={quizGameCopy.fillBlank.placeholder}
            className="w-full min-h-[72px] h-20 md:h-24 text-2xl md:text-3xl text-center rounded-[24px] border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-all"
            disabled={submitted}
            aria-label={quizGameCopy.fillBlank.placeholder}
          />
          {submitted && (
            <motion.div
              className={cn(
                "absolute inset-0 flex items-center justify-center rounded-[24px] z-10 border backdrop-blur-md",
                isCorrect
                  ? "border-emerald-400 bg-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  : "border-rose-400 bg-rose-500/25 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
              )}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {isCorrect ? (
                <CheckCircle className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]" />
              ) : (
                <XCircle className="w-16 h-16 text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.3)]" />
              )}
            </motion.div>
          )}
        </div>

        {!submitted ? (
          <Button
            size="lg"
            className="zenith-btn-glow min-h-11 h-14 px-12 text-xl font-bold rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-0"
            onClick={checkAnswer}
            disabled={!userAnswer.trim()}
          >
            {quizGameCopy.fillBlank.submit}
          </Button>
        ) : (
          <p className={cn(
            "text-2xl font-black uppercase tracking-wider",
            isCorrect ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" : "text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]"
          )}>
            {isCorrect
              ? quizGameCopy.fillBlank.correct
              : quizGameCopy.fillBlank.wrong}
          </p>
        )}
      </div>
    </div>
  );
}
