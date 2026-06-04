"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import type { ReadingQuestion, ReadingSubQuestion } from "@/types/quiz";
import { quizGameCopy } from "./copy";
import { useSubQuestionMotion } from "./motion";

interface ReadingCardProps {
  question: ReadingQuestion;
  onSubAnswer: (subId: string, answer: string) => void;
  onComplete: (question: ReadingQuestion) => void;
  readingSubAnswers: Record<string, string>;
  currentSubQuestionIndex: number;
  isReadingQuestionComplete: () => boolean;
}

function SubQuestionInput({
  sub,
  userAnswer,
  onAnswer,
}: {
  sub: ReadingSubQuestion;
  userAnswer?: string;
  onAnswer: (answer: string) => void;
}) {
  const [fillText, setFillText] = useState("");
  const answered = !!userAnswer;

  if (sub.type === "multiple-choice" && sub.options?.length) {
    return (
      <div className="space-y-3" role="group" aria-label="Lựa chọn">
        {sub.options.map((option) => {
          const isSelected = userAnswer === option.id;
          const isCorrect =
            answered && sub.correctOptionId === option.id;
          const isWrong = answered && isSelected && !isCorrect;

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => !answered && onAnswer(option.id)}
              disabled={answered}
              className={cn(
                "w-full min-h-[44px] rounded-2xl border p-4 font-semibold text-lg text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-violet-400 focus-visible:ring-offset-slate-900",
                answered
                  ? "cursor-default"
                  : "border-white/10 bg-white/5 hover:border-violet-500/50 hover:bg-violet-500/5 hover:shadow-[0_0_12px_rgba(167,139,250,0.15)]",
                isCorrect && "neon-border-emerald bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.3)]",
                isWrong && "neon-border-rose bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.3)] card-shake",
              )}
            >
              {option.text}
            </motion.button>
          );
        })}
      </div>
    );
  }

  if (sub.type === "fill-in-the-blank") {
    return (
      <div className="space-y-3">
        <Input
          value={answered ? userAnswer : fillText}
          onChange={(e) => setFillText(e.target.value)}
          disabled={answered}
          placeholder={quizGameCopy.fillBlank.placeholder}
          className="min-h-11 h-16 text-xl text-center bg-white/5 border-white/10 text-white focus-visible:ring-0 focus-visible:border-violet-400 focus-visible:shadow-[0_0_15px_rgba(167,139,250,0.2)] focus-visible:ring-offset-0 transition-all duration-300"
        />
        {!answered && (
          <Button
            className="w-full h-12 shadow-[0_0_15px_rgba(167,139,250,0.3)] bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
            disabled={!fillText.trim()}
            onClick={() => onAnswer(fillText.trim())}
          >
            {quizGameCopy.fillBlank.submit}
          </Button>
        )}
      </div>
    );
  }

  if (sub.type === "true-false") {
    const options = [
      { value: "true", label: quizGameCopy.trueFalse.true },
      { value: "false", label: quizGameCopy.trueFalse.false },
    ] as const;

    return (
      <div className="grid grid-cols-2 gap-3" role="group">
        {options.map(({ value, label }) => {
          const isSelected = userAnswer === value;
          const isCorrect =
            answered &&
            String(sub.correctAnswer) === value;
          const isWrong = answered && isSelected && !isCorrect;

          return (
            <Button
              key={value}
              type="button"
              variant="outline"
              disabled={answered}
              onClick={() => !answered && onAnswer(value)}
              className={cn(
                "min-h-[44px] h-20 text-xl font-bold focus-visible:ring-0 transition-all duration-300",
                answered
                  ? "cursor-default"
                  : "border-white/10 bg-white/5 hover:border-violet-500/50 hover:bg-violet-500/5 hover:shadow-[0_0_12px_rgba(167,139,250,0.15)]",
                isCorrect && "neon-border-emerald bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.3)]",
                isWrong && "neon-border-rose bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.3)] card-shake",
              )}
            >
              {label}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <p className="text-slate-400">{quizGameCopy.reading.noOptions}</p>
  );
}

export default function ReadingCard({
  question,
  onSubAnswer,
  onComplete,
  readingSubAnswers,
  currentSubQuestionIndex,
  isReadingQuestionComplete,
}: ReadingCardProps) {
  const currentSub = question.questions[currentSubQuestionIndex];
  const isComplete = isReadingQuestionComplete();
  const answeredCount = Object.keys(readingSubAnswers).length;
  const totalSubs = question.questions.length;
  const { variants: subVariants, transition: subTransition } =
    useSubQuestionMotion();

  if (!currentSub) {
    return null;
  }

  const handleSubSubmit = (answer: string) => {
    if (readingSubAnswers[currentSub.id]) return;
    onSubAnswer(currentSub.id, answer);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-black/10 min-h-0">
      <div className="flex-1 flex flex-col lg:flex-row border-b border-white/10 min-h-0">
        <div className="lg:w-1/2 h-[40vh] lg:h-auto overflow-y-auto p-4 md:p-6">
          <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed bg-black/35 rounded-2xl border border-white/10 p-6 whitespace-pre-wrap shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
            {question.passage}
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col p-4 md:p-6 min-h-0 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            {question.questions.map((sub, i) => (
              <span
                key={sub.id}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all",
                  i < answeredCount
                    ? "bg-emerald-400"
                    : i === currentSubQuestionIndex
                      ? "bg-violet-400 ring-2 ring-violet-300/50 shadow-[0_0_8px_rgba(167,139,250,0.6)]"
                      : "bg-white/25",
                )}
                aria-hidden
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSub.id}
              variants={subVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={subTransition}
            >
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2 text-neon-glow-violet">
                {currentSub.question}
              </h2>
              <p className="text-slate-400 mb-4 font-semibold uppercase tracking-wider text-xs">
                {quizGameCopy.reading.questionOf(
                  currentSubQuestionIndex + 1,
                  totalSubs,
                )}
              </p>
              <SubQuestionInput
                key={currentSub.id}
                sub={currentSub}
                userAnswer={readingSubAnswers[currentSub.id]}
                onAnswer={handleSubSubmit}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 md:p-6 border-t border-white/20 bg-black/50 shrink-0">
        <Button
          onClick={() => onComplete(question)}
          disabled={!isComplete}
          size="lg"
          className={cn(
            "w-full h-16 text-lg font-extrabold rounded-2xl transition-all duration-300",
            isComplete
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.35)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] border-0 text-white cursor-pointer"
              : "opacity-50 cursor-not-allowed",
          )}
        >
          <ChevronRight className="w-6 h-6 mr-2" />
          {isComplete
            ? quizGameCopy.reading.complete(answeredCount, totalSubs)
            : quizGameCopy.reading.answerAll(totalSubs)}
        </Button>
      </div>
    </div>
  );
}
