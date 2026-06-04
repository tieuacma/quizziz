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
          className="font-display text-4xl md:text-5xl font-extrabold text-center leading-tight px-4 max-w-4xl zenith-gradient-text-static"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {question.question}
        </motion.h2>
      </div>

      <div
        className="h-1/2 zenith-panel p-6"
        role="group"
        aria-label="Đúng hoặc Sai"
      >
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto w-full h-full"
          variants={optionStagger}
          initial="initial"
          animate="animate"
        >
          {options.map(({ value, label }, index) => {
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
                  "h-full min-h-[64px] sm:min-h-[120px] rounded-3xl border font-bold text-2xl flex items-center justify-center p-6 transition-all duration-300 relative",
                  "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                  value === true && !submitted && "hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]",
                  value === false && !submitted && "hover:border-rose-500/30 hover:bg-rose-500/[0.02]",
                  isCorrect &&
                    "border-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.25)]",
                  isWrong &&
                    "border-rose-400 bg-rose-500/20 shadow-[0_0_20px_rgba(239,68,68,0.25)]",
                )}
                whileHover={submitted ? { scale: 1 } : { scale: 1.02 }}
                whileTap={submitted ? { scale: 1 } : { scale: 0.98 }}
              >
                {/* Option Letter Indicator */}
                <span className={cn(
                  "font-mono text-xs font-black px-2.5 py-1 rounded-xl border absolute left-4 shrink-0 transition-colors",
                  isCorrect
                    ? "text-emerald-300 bg-emerald-500/20 border-emerald-500/30"
                    : isWrong
                    ? "text-red-300 bg-red-500/20 border-red-500/30"
                    : isSelected
                    ? "text-violet-300 bg-violet-500/20 border-violet-500/30"
                    : "text-slate-400 bg-slate-800/40 border-white/10"
                )}>
                  {index === 0 ? "A" : "B"}
                </span>

                <span className="text-center leading-relaxed z-10 flex items-center gap-2">
                  <span>{value ? "✅" : "❌"}</span>
                  <span>{label}</span>
                </span>
                {isCorrect && (
                  <CheckCircle className="absolute top-3 right-3 w-8 h-8 text-emerald-400" />
                )}
                {isWrong && (
                  <XCircle className="absolute top-3 right-3 w-8 h-8 text-red-400" />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
