"use client";

import React, { useState } from "react";

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrueFalseQuestion } from "@/types/quiz";
import { quizGameCopy } from "./copy";
import {
  QUESTION_FEEDBACK_MS,
  optionItemVariants,
  optionStagger,
} from "./motion";

interface TrueFalseCardProps {
  question: TrueFalseQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export default function TrueFalseCard({
  question,
  onAnswer,
}: TrueFalseCardProps) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (value: boolean) => {
    if (submitted) return;
    setSelected(value);
    setSubmitted(true);
    const isCorrect = value === question.correctAnswer;
    setTimeout(() => onAnswer(isCorrect), QUESTION_FEEDBACK_MS);
  };

  const options = [
    { value: true, label: quizGameCopy.trueFalse.true },
    { value: false, label: quizGameCopy.trueFalse.false },
  ] as const;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="h-1/2 flex items-center justify-center p-4">
        <motion.h2
          className="text-4xl md:text-5xl font-black text-white text-center leading-tight px-4 max-w-4xl"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {question.question}
        </motion.h2>
      </div>

      <div
        className="h-1/2 bg-black/40 backdrop-blur-xl p-6"
        role="group"
        aria-label="Đúng hoặc Sai"
      >
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto w-full h-full"
          variants={optionStagger}
          initial="initial"
          animate="animate"
        >
          {options.map(({ value, label }) => {
            const isSelected = selected === value;
            const isCorrect = submitted && value === question.correctAnswer;
            const isWrong = submitted && isSelected && !isCorrect;

            return (
              <motion.button
                key={String(value)}
                type="button"
                variants={optionItemVariants}
                onClick={() => handleSelect(value)}
                disabled={submitted}
                className={cn(
                  "h-full min-h-[120px] rounded-3xl border font-bold text-2xl flex items-center justify-center transition-all duration-300 relative",
                  "border-white/20 bg-white/5 hover:border-white/35",
                  isCorrect &&
                    "border-emerald-300/70 bg-emerald-500/20 shadow-[0_0_35px_rgba(16,185,129,0.35)]",
                  isWrong &&
                    "border-red-300/70 bg-red-500/20 shadow-[0_0_35px_rgba(239,68,68,0.35)]",
                )}
                whileHover={submitted ? { scale: 1 } : { scale: 1.02 }}
                whileTap={submitted ? { scale: 1 } : { scale: 0.98 }}
              >
                {label}
                {isCorrect && (
                  <CheckCircle className="absolute top-3 right-3 w-10 h-10 text-emerald-400" />
                )}
                {isWrong && (
                  <XCircle className="absolute top-3 right-3 w-10 h-10 text-red-400" />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
