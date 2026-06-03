"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  QuizQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
} from "@/types/quiz";

interface FlashcardReviewProps {
  questions: QuizQuestion[];
}

export default function FlashcardReview({ questions }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % questions.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + questions.length) % questions.length,
      );
    }, 150);
  };

  const getCorrectAnswerText = (q: QuizQuestion): string => {
    if (q.type === "multiple-choice") {
      const mcq = q as MultipleChoiceQuestion;
      const correctOption = mcq.options.find(
        (o) => o.id === mcq.correctOptionId,
      );
      return correctOption ? correctOption.text : "Không rõ đáp án";
    }
    if (q.type === "true-false") {
      const tfq = q as TrueFalseQuestion;
      return tfq.correctAnswer ? "Đúng" : "Sai";
    }
    if (q.type === "fill-in-the-blank") {
      const answers = (
        q as unknown as { answers?: (string | null | undefined)[] }
      ).answers;
      return answers?.filter(Boolean).join(" hoặc ") || "Không rõ";
    }

    return "Đang tải...";
  };

  const getExplanation = (q: QuizQuestion): string => {
    if (q.type === "multiple-choice") {
      return (
        (q as MultipleChoiceQuestion).explanation ||
        "Gợi ý: Hãy đọc kỹ câu hỏi và ghi nhớ đáp án chính xác này nhé!"
      );
    }
    if (q.type === "true-false") {
      return (
        (q as TrueFalseQuestion).explanation ||
        "Gợi ý: Khẳng định này là chính xác/không chính xác như đã giải thích."
      );
    }
    return "Hãy tập trung ghi nhớ cách làm câu này để đạt điểm cao hơn lần sau!";
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
      <div className="text-sm font-black uppercase text-indigo-300 tracking-wider">
        Thẻ ghi nhớ câu sai ({currentIndex + 1} / {questions.length})
      </div>

      {/* 3D Flashcard Container */}
      <div className="w-full h-[320px] relative perspective-1000">
        <motion.div
          className="w-full h-full relative cursor-pointer transform-style-3d"
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* FRONT SIDE (Question) */}
          <div className="absolute inset-0 w-full h-full rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl p-8 flex flex-col justify-between backface-hidden">
            <div className="flex flex-col gap-4">
              <span className="self-start px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 font-extrabold text-[10px] uppercase tracking-wide border border-rose-500/20">
                Câu Hỏi Sai
              </span>
              <h3 className="text-xl md:text-2xl font-black text-white leading-snug">
                {currentQuestion.question}
              </h3>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>
                Độ khó:{" "}
                <strong className="text-indigo-300 uppercase font-extrabold">
                  {currentQuestion.difficulty}
                </strong>
              </span>
              <span className="flex items-center gap-1 text-indigo-400 font-extrabold">
                <RotateCw className="w-3.5 h-3.5" /> Click để lật xem đáp án
              </span>
            </div>
          </div>

          {/* BACK SIDE (Answer & Explanation) */}
          <div className="absolute inset-0 w-full h-full rounded-3xl border border-emerald-500/20 bg-emerald-950/40 backdrop-blur-xl shadow-2xl p-8 flex flex-col justify-between backface-hidden transform-rotateY-180">
            <div className="flex flex-col gap-4">
              <span className="self-start px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-extrabold text-[10px] uppercase tracking-wide border border-emerald-500/25">
                Đáp Án Đúng
              </span>
              <div>
                <div className="text-2xl font-black text-emerald-300 leading-snug mb-3 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                  {getCorrectAnswerText(currentQuestion)}
                </div>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium italic">
                  {getExplanation(currentQuestion)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span className="flex items-center gap-1 font-extrabold">
                <Eye className="w-3.5 h-3.5" /> Ghi nhớ kiến thức
              </span>
              <span className="flex items-center gap-1 font-extrabold">
                <RotateCw className="w-3.5 h-3.5" /> Click để lật lại câu hỏi
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-6">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={questions.length <= 1}
          className="w-12 h-12 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-indigo-300 cursor-pointer shadow-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="font-bold text-sm text-indigo-300 bg-indigo-950/30 border border-white/10 px-4 py-2 rounded-full shadow-inner">
          {currentIndex + 1} / {questions.length} thẻ
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={questions.length <= 1}
          className="w-12 h-12 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-indigo-300 cursor-pointer shadow-md"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
