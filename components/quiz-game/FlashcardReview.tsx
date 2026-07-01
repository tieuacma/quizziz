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
                (prev) => (prev - 1 + questions.length) % questions.length
            );
        }, 150);
    };

    const getCorrectAnswerText = (q: QuizQuestion): string => {
        if (q.type === "multiple-choice") {
            const mcq = q as MultipleChoiceQuestion;
            const correctOption = mcq.options.find(
                (o) => o.id === mcq.correctOptionId
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
            <div className="text-xs font-black uppercase text-cyan-400 tracking-widest text-neon-glow-cyan animate-pulse">
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
                    <div className="absolute inset-0 w-full h-full rounded-3xl border-2 border-violet-500/20 bg-slate-950/70 backdrop-blur-xl p-8 flex flex-col justify-between backface-hidden transition-all duration-500 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(167,139,250,0.25)] neon-border-violet">
                        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-violet-500/5 via-transparent to-cyan-500/5 rounded-3xl pointer-events-none" />
                        <div className="flex flex-col gap-4 relative z-10">
                            <span className="self-start px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-extrabold text-[10px] uppercase tracking-wide shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                                Câu Hỏi Sai
                            </span>
                            <h3 className="text-xl md:text-2xl font-black text-white leading-snug">
                                {currentQuestion.question}
                            </h3>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 font-medium relative z-10">
                            <span>
                                Độ khó:{" "}
                                <strong className="text-indigo-300 uppercase font-black">
                                    {currentQuestion.difficulty}
                                </strong>
                            </span>
                            <span className="flex items-center gap-1 text-violet-400 font-extrabold text-neon-glow-violet animate-pulse">
                                <RotateCw className="w-3.5 h-3.5" /> Click để
                                lật xem đáp án
                            </span>
                        </div>
                    </div>

                    {/* BACK SIDE (Answer & Explanation) */}
                    <div className="absolute inset-0 w-full h-full rounded-3xl border-2 border-emerald-500/30 bg-emerald-950/40 backdrop-blur-xl p-8 flex flex-col justify-between backface-hidden transform-rotateY-180 transition-all duration-500 hover:border-emerald-500/60 hover:shadow-[0_0_30px_rgba(52,211,153,0.25)] neon-border-emerald">
                        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5 rounded-3xl pointer-events-none" />
                        <div className="flex flex-col gap-4 relative z-10">
                            <span className="self-start px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-[10px] uppercase tracking-wide shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                                Đáp Án Đúng
                            </span>
                            <div>
                                <div className="text-2xl font-black text-emerald-300 leading-snug mb-3 text-neon-glow-emerald drop-shadow-[0_0_12px_rgba(52,211,153,0.45)]">
                                    {getCorrectAnswerText(currentQuestion)}
                                </div>
                                <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium italic">
                                    {getExplanation(currentQuestion)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-medium relative z-10">
                            <span className="flex items-center gap-1 font-black uppercase text-[10px] tracking-wide text-neon-glow-emerald">
                                <Eye className="w-3.5 h-3.5" /> Ghi nhớ kiến
                                thức
                            </span>
                            <span className="flex items-center gap-1 font-black uppercase text-[10px] tracking-wide text-neon-glow-emerald animate-pulse">
                                <RotateCw className="w-3.5 h-3.5" /> Lật lại câu
                                hỏi
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
                    className="w-12 h-12 rounded-full border-2 border-violet-500/20 bg-violet-950/20 text-violet-300 shadow-md hover:border-violet-500/50 hover:shadow-[0_0_15px_rgba(167,139,250,0.25)] hover:bg-violet-950/40 cursor-pointer transition-all duration-300 neon-border-violet disabled:opacity-30 disabled:pointer-events-none"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Button>
                <div className="font-black text-sm text-cyan-400 text-neon-glow-cyan bg-cyan-950/20 border-2 border-cyan-500/20 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.15)] neon-border-cyan">
                    {currentIndex + 1} / {questions.length} thẻ
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    disabled={questions.length <= 1}
                    className="w-12 h-12 rounded-full border-2 border-violet-500/20 bg-violet-950/20 text-violet-300 shadow-md hover:border-violet-500/50 hover:shadow-[0_0_15px_rgba(167,139,250,0.25)] hover:bg-violet-950/40 cursor-pointer transition-all duration-300 neon-border-violet disabled:opacity-30 disabled:pointer-events-none"
                >
                    <ChevronRight className="w-6 h-6" />
                </Button>
            </div>
        </div>
    );
}
