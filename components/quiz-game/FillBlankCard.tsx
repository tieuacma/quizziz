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
          className="text-3xl md:text-5xl font-black text-white text-center leading-tight max-w-4xl"
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
            className="w-full h-20 md:h-24 text-2xl md:text-3xl text-center rounded-3xl border-2 border-white/20 bg-white/10 text-white placeholder:text-slate-400"
            disabled={submitted}
            aria-label={quizGameCopy.fillBlank.placeholder}
          />
          {submitted && (
            <motion.div
              className={cn(
                "absolute inset-0 flex items-center justify-center rounded-3xl z-10",
                isCorrect ? "bg-emerald-500/90" : "bg-red-500/90",
              )}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {isCorrect ? (
                <CheckCircle className="w-16 h-16 text-white" />
              ) : (
                <XCircle className="w-16 h-16 text-white" />
              )}
            </motion.div>
          )}
        </div>

        {!submitted ? (
          <Button
            size="lg"
            className="h-14 px-12 text-xl font-bold"
            onClick={checkAnswer}
            disabled={!userAnswer.trim()}
          >
            {quizGameCopy.fillBlank.submit}
          </Button>
        ) : (
          <p className="text-2xl font-bold text-white">
            {isCorrect
              ? quizGameCopy.fillBlank.correct
              : quizGameCopy.fillBlank.wrong}
          </p>
        )}
      </div>
    </div>
  );
}
