"use client";

import React, { useMemo, useState, useRef, useCallback } from "react";

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
import { useParticleEffect } from "./ParticleSystem";

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
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { triggerEffect } = useParticleEffect();

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

  const handleSingleClick = useCallback(
    (optionId: string, index: number) => {
      if (submitted || selectedSingle) return;
      setSelectedSingle(optionId);
      setSubmitted(true);
      const isCorrect = gradeMultipleChoice(
        question.correctOptionId,
        optionId,
        false,
      );

      // Trigger particle effect at button position
      const button = buttonRefs.current[index];
      if (button) {
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        triggerEffect(isCorrect ? "correct" : "wrong", x, y);
      }

      setTimeout(() => onAnswer(isCorrect), QUESTION_FEEDBACK_MS);
    },
    [
      submitted,
      selectedSingle,
      question.correctOptionId,
      triggerEffect,
      onAnswer,
    ],
  );

  const toggleMulti = (optionId: string) => {
    if (submitted) return;
    setSelectedIds((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const submitMulti = useCallback(() => {
    if (submitted || selectedIds.length === 0) return;
    setSubmitted(true);
    const isCorrect = gradeMultipleChoice(
      question.correctOptionId,
      selectedIds.join(","),
      true,
    );

    // Trigger particle effect at center of selected options
    const firstSelectedIndex = question.options.findIndex((o) =>
      selectedIds.includes(o.id),
    );
    if (firstSelectedIndex >= 0) {
      const button = buttonRefs.current[firstSelectedIndex];
      if (button) {
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        triggerEffect(isCorrect ? "correct" : "wrong", x, y);
      }
    }

    setTimeout(() => onAnswer(isCorrect), QUESTION_FEEDBACK_MS);
  }, [submitted, selectedIds, question, triggerEffect, onAnswer]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="h-1/2 flex items-center justify-center p-4 relative">
        <motion.h2
          className="font-display text-3xl md:text-5xl font-extrabold text-center leading-tight px-4 max-w-4xl zenith-gradient-text text-neon-glow-violet"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {question.question}
        </motion.h2>
        {isMulti && !submitted && (
          <p className="absolute bottom-4 text-sm text-cyan-400 font-bold uppercase tracking-wider text-neon-glow-cyan animate-pulse">
            Chọn tất cả đáp án đúng
          </p>
        )}
      </div>

      <div className="h-1/2 zenith-panel p-4 md:p-6 flex flex-col min-h-0">
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
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                variants={optionItemVariants}
                onClick={() =>
                  isMulti
                    ? toggleMulti(option.id)
                    : handleSingleClick(option.id, index)
                }
                disabled={submitted && !isMulti}
                className={cn(
                  "min-h-[56px] md:min-h-[88px] rounded-3xl border font-bold text-lg md:text-xl flex items-center justify-center px-14 py-4 transition-all duration-300 relative overflow-hidden",
                  "border-white/10 bg-white/5 hover:border-violet-500/50 hover:bg-violet-500/5 hover:shadow-[0_0_15px_rgba(167,139,250,0.15)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                  !submitted &&
                    isSelected &&
                    "neon-border-violet bg-violet-500/20 shadow-[0_0_20px_rgba(167,139,250,0.3)]",
                  isCorrect &&
                    "neon-border-emerald bg-emerald-500/20 shadow-[0_0_25px_rgba(52,211,153,0.4)]",
                  isWrong &&
                    "neon-border-rose bg-rose-500/20 shadow-[0_0_25px_rgba(244,63,94,0.4)] card-shake",
                )}
                whileHover={submitted ? { scale: 1 } : { scale: 1.02 }}
                whileTap={submitted ? { scale: 1 } : { scale: 0.98 }}
              >
                {/* Shimmer effect on hover */}
                {!submitted && (
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer-wave_1.5s_infinite]" />
                  </div>
                )}
                {/* Option Letter Indicator */}
                <span
                  className={cn(
                    "font-mono text-xs font-black px-2.5 py-1 rounded-xl border absolute left-4 shrink-0 transition-colors",
                    isCorrect
                      ? "text-emerald-300 bg-emerald-500/20 border-emerald-500/40 text-neon-glow-emerald"
                      : isWrong
                        ? "text-rose-300 bg-rose-500/20 border-rose-500/40 text-neon-glow-rose"
                        : isSelected
                          ? "text-violet-300 bg-violet-500/20 border-violet-500/40 text-neon-glow-violet"
                          : "text-slate-400 bg-slate-800/40 border-white/10",
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="text-center leading-relaxed z-10 text-slate-100">
                  {option.text}
                </span>

                {isCorrect && (
                  <CheckCircle className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                )}
                {isWrong && (
                  <XCircle className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 text-red-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {isMulti && !submitted && (
          <Button
            size="lg"
            className="zenith-btn-glow mt-4 w-full max-w-md mx-auto min-h-11 h-14 text-lg font-extrabold rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-0 shadow-[0_0_20px_rgba(167,139,250,0.35)]"
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
