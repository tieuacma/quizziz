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
          className="text-3xl md:text-5xl font-black text-white text-center leading-tight px-4 max-w-4xl"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {question.question}
        </motion.h2>
        {isMulti && !submitted && (
          <p className="absolute bottom-4 text-sm text-slate-300">
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
          {displayedOptions.map((option) => {
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
                  "min-h-[88px] rounded-3xl border font-bold text-lg md:text-xl flex items-center justify-center p-4 transition-all duration-300 relative",
                  "border-white/20 bg-white/5 hover:border-white/35",
                  !submitted &&
                    isSelected &&
                    "border-indigo-400/60 bg-indigo-500/20",
                  isCorrect &&
                    "border-emerald-300/70 bg-emerald-500/20 shadow-[0_0_35px_rgba(16,185,129,0.35)]",
                  isWrong &&
                    "border-red-300/70 bg-red-500/20 shadow-[0_0_35px_rgba(239,68,68,0.35)]",
                )}
                whileHover={submitted ? { scale: 1 } : { scale: 1.02 }}
                whileTap={submitted ? { scale: 1 } : { scale: 0.98 }}
              >
                <span className="text-center leading-relaxed z-10">
                  {option.text}
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

        {isMulti && !submitted && (
          <Button
            size="lg"
            className="mt-4 w-full max-w-md mx-auto h-14 text-lg font-bold"
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
