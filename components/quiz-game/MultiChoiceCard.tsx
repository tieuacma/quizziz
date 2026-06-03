"use client";

import React, { useMemo, useState } from "react";

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  gradeMultipleChoice,
  parseCorrectOptionIds,
} from "@/lib/quiz-game/grade";
import type { MultipleChoiceQuestion } from "@/types/quiz";
import {
  QUESTION_FEEDBACK_MS,
  optionItemVariants,
  optionStagger,
} from "./motion";

interface MultiChoiceCardProps {
  question: MultipleChoiceQuestion;
  onAnswer: (isCorrect: boolean) => void;
  eraserActive?: boolean;
}

export default function MultiChoiceCard({
  question,
  onAnswer,
  eraserActive,
}: MultiChoiceCardProps) {
  const isMulti = question.isMultiChoice === true;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedSingle, setSelectedSingle] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correctIds = useMemo(
    () => parseCorrectOptionIds(question.correctOptionId),
    [question.correctOptionId],
  );

  const displayedOptions = useMemo(() => {
    if (!eraserActive) return question.options;

    // Filter to keep correct options
    const correct = question.options.filter((o) => correctIds.includes(o.id));
    // Keep only 1 incorrect option (so 50/50 removes the rest)
    const incorrect = question.options.filter(
      (o) => !correctIds.includes(o.id),
    );
    // Avoid Math.random() during render (impure). Pick a deterministic incorrect option.
    const randomIncorrect = incorrect.slice(0, 1);

    return [...correct, ...randomIncorrect].sort((a, b) =>
      a.id.localeCompare(b.id),
    );
  }, [question.options, correctIds, eraserActive]);

  const handleSingleClick = (optionId: string) => {
    if (submitted || selectedSingle) return;
    setSelectedSingle(optionId);
    setSubmitted(true);
    const isCorrect = gradeMultipleChoice(
      question.correctOptionId,
      optionId,
      false,
    );
    setTimeout(() => onAnswer(isCorrect), QUESTION_FEEDBACK_MS);
  };

  const toggleMulti = (optionId: string) => {
    if (submitted) return;
    setSelectedIds((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const submitMulti = () => {
    if (submitted || selectedIds.length === 0) return;
    setSubmitted(true);
    const isCorrect = gradeMultipleChoice(
      question.correctOptionId,
      selectedIds.join(","),
      true,
    );
    setTimeout(() => onAnswer(isCorrect), QUESTION_FEEDBACK_MS);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="h-1/2 flex items-center justify-center p-4 relative">
        <motion.h2
          className="text-3xl md:text-5xl font-black text-white text-center leading-tight px-4 max-w-4xl bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {question.question}
        </motion.h2>
        {isMulti && !submitted && (
          <p className="absolute bottom-4 text-sm text-slate-400 font-bold uppercase tracking-wider">
            Chọn tất cả đáp án đúng
          </p>
        )}
      </div>

      <div className="h-1/2 bg-black/40 backdrop-blur-xl p-4 md:p-6 flex flex-col min-h-0">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-5xl mx-auto w-full flex-1 min-h-0 overflow-y-auto"
          role="group"
          aria-label="Lựa chọn trắc nghiệm"
          variants={optionStagger}
          initial="initial"
          animate="animate"
        >
          {displayedOptions.map((option, index) => {
            const isSelected = isMulti
              ? selectedIds.includes(option.id)
              : selectedSingle === option.id;
            const isCorrect = submitted && correctIds.includes(option.id);
            const isWrong = submitted && isSelected && !isCorrect;

            return (
              <motion.button
                key={option.id}
                type="button"
                variants={optionItemVariants}
                onClick={() =>
                  isMulti
                    ? toggleMulti(option.id)
                    : handleSingleClick(option.id)
                }
                disabled={submitted && !isMulti}
                className={cn(
                  "min-h-[56px] md:min-h-[88px] rounded-3xl border font-bold text-lg md:text-xl flex items-center justify-center px-14 py-4 transition-all duration-300 relative",
                  "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                  !submitted &&
                    isSelected &&
                    "border-indigo-400 bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]",
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
                    ? "text-indigo-300 bg-indigo-500/20 border-indigo-500/30"
                    : "text-slate-400 bg-slate-800/40 border-white/10"
                )}>
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="text-center leading-relaxed z-10 text-slate-100">
                  {option.text}
                </span>

                {isCorrect && (
                  <CheckCircle className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 text-emerald-400" />
                )}
                {isWrong && (
                  <XCircle className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 text-red-400" />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {isMulti && !submitted && (
          <Button
            size="lg"
            className="mt-4 w-full max-w-md mx-auto min-h-11 h-14 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-[0_4px_24px_rgba(99,102,241,0.2)] focus-visible:ring-2 focus-visible:ring-indigo-400"
            disabled={selectedIds.length === 0}
            onClick={submitMulti}
          >
            Xác nhận ({selectedIds.length} đã chọn)
          </Button>
        )}
      </div>
    </div>
  );
}
