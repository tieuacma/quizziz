"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion, MultipleChoiceQuestion, TrueFalseQuestion } from "@/types/quiz";

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
      setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
    }, 150);
  };

  const getCorrectAnswerText = (q: QuizQuestion): string => {
    if (q.type === "multiple-choice") {
      const mcq = q as MultipleChoiceQuestion;
      const correctOption = mcq.options.find((o) => o.id === mcq.correctOptionId);
      return correctOption ? correctOption.text : "Không rõ đáp án";
    }
    if (q.type === "true-false") {
      const tfq = q as TrueFalseQuestion;
      return tfq.correctAnswer ? "Đúng" : "Sai";
    }
    if (q.type === "fill-in-the-blank") {
      return (q as any).answers?.join(" hoặc ") || "Không rõ";
    }
    return "Đang tải...";
  };

  const getExplanation = (q: QuizQuestion): string => {
    if (q.type === "multiple-choice") {
      return (q as MultipleChoiceQuestion).explanation || "Gợi ý: Hãy đọc kỹ câu hỏi và ghi nhớ đáp án chính xác này nhé!";
    }
    if (q.type === "true-false") {
      return (q as TrueFalseQuestion).explanation || "Gợi ý: Khẳng định này là chính xác/không chính xác như đã giải thích.";
    }
    return "Hãy tập trung ghi nhớ cách làm câu này để đạt điểm cao hơn lần sau!";
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
      <div className="text-sm font-black uppercase text-emerald-800 tracking-wider">
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
          <div
            className="absolute inset-0 w-full h-full rounded-3xl border border-emerald-200 bg-white shadow-xl p-8 flex flex-col justify-between backface-hidden"
          >
            <div className="flex flex-col gap-4">
              <span className="self-start px-3 py-1 rounded-full bg-red-50 text-red-600 font-extrabold text-[10px] uppercase tracking-wide border border-red-100">
                Câu Hỏi Sai
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-snug">
                {currentQuestion.question}
              </h3>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Độ khó: <strong className="text-slate-600 uppercase font-extrabold">{currentQuestion.difficulty}</strong></span>
              <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                <RotateCw className="w-3.5 h-3.5" /> Click để lật xem đáp án
              </span>
            </div>
          </div>

          {/* BACK SIDE (Answer & Explanation) */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl border border-emerald-300 bg-emerald-50 shadow-xl p-8 flex flex-col justify-between backface-hidden transform-rotateY-180"
          >
            <div className="flex flex-col gap-4">
              <span className="self-start px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[10px] uppercase tracking-wide border border-emerald-200">
                Đáp Án Đúng
              </span>
              <div>
                <div className="text-2xl font-black text-emerald-900 leading-snug mb-3">
                  {getCorrectAnswerText(currentQuestion)}
                </div>
                <p className="text-sm md:text-base text-emerald-800/80 leading-relaxed font-medium italic">
                  {getExplanation(currentQuestion)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-600 font-medium">
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
          className="w-12 h-12 rounded-full border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 cursor-pointer shadow-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="font-bold text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full shadow-inner">
          {currentIndex + 1} / {questions.length} thẻ
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={questions.length <= 1}
          className="w-12 h-12 rounded-full border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 cursor-pointer shadow-md"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
