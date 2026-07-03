"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Phone, Wifi, Sparkles, AlertCircle } from "lucide-react";
import {
    QuizQuestion,
    MultipleChoiceQuestion,
    FillInBlankQuestion,
    TrueFalseQuestion,
    ReadingQuestion,
} from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizLivePreviewProps {
    question: QuizQuestion | null;
    defaultTime?: number;
}

export default function QuizLivePreview({
    question,
    defaultTime = 30,
}: QuizLivePreviewProps) {
    const [selectedSubIndex, setSelectedSubIndex] = useState(0);

    // Keep local preview state stable; reset is handled by keyed rendering in the reading sub-tree.

    if (!question) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-2xl p-6 bg-slate-950/20">
                <AlertCircle className="w-10 h-10 mb-2 stroke-[1.5]" />
                <p className="text-sm">
                    Chọn một câu hỏi để xem trước giao diện di động
                </p>
            </div>
        );
    }

    const timeLimit = question.timeLimit || defaultTime;

    return (
        <div className="flex flex-col items-center w-full">
            {/* Visual Header Guide */}
            <div className="flex items-center gap-1.5 mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-900/60 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Live Student Preview
            </div>

            {/* iPhone-like Mockup Container */}
            <div className="relative w-full max-w-[320px] aspect-[9/19] rounded-[42px] border-[10px] border-slate-900 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05),0_0_40px_rgba(99,102,241,0.15)] overflow-hidden flex flex-col select-none">
                {/* Notch / Dynamic Island Simulation */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-50 flex items-center justify-between px-3">
                    <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800" />
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                </div>

                {/* Status Bar */}
                <div className="h-9 pt-3 px-6 flex justify-between items-center text-[10px] font-bold text-white/90 z-40 bg-slate-950/60 backdrop-blur-sm pointer-events-none">
                    <span>09:41</span>
                    <div className="flex items-center gap-1.5">
                        <Wifi className="w-3 h-3" />
                        <Phone className="w-2.5 h-2.5" />
                        <div className="flex items-center gap-0.5 border border-white/40 rounded-[3px] p-[1px] w-5 h-2.5">
                            <div className="bg-white rounded-[1px] h-full w-full" />
                        </div>
                    </div>
                </div>

                {/* Mobile Viewport Screen */}
                <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2 flex flex-col justify-between relative bg-gradient-to-br from-indigo-950 via-purple-950/80 to-slate-950">
                    <div className="pointer-events-none absolute inset-0 opacity-30">
                        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />
                        <div className="absolute bottom-1/4 right-0 h-36 w-36 rounded-full bg-purple-500/15 blur-2xl" />
                    </div>
                    <div className="relative z-10 flex flex-1 flex-col justify-between min-h-0">
                        {/* Top Info Bar (Timer & Points) */}
                        <div className="space-y-2 mt-1">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                                <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                                    Câu 1/1
                                </span>
                                <span className="text-indigo-300 font-mono">
                                    1,000 pts
                                </span>
                            </div>

                            {/* Animated Time limit progress bar */}
                            <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{
                                        duration: timeLimit,
                                        ease: "linear",
                                        repeat: Infinity,
                                    }}
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                                />
                                <div className="absolute inset-0 flex items-center justify-end pr-2 text-[8px] font-mono text-white pointer-events-none">
                                    <Clock className="w-2 h-2 mr-0.5 inline" />{" "}
                                    {timeLimit}s
                                </div>
                            </div>
                        </div>

                        {/* Main Question Card / Content Section */}
                        <div className="my-auto py-4 space-y-4">
                            {/* Question Text Box */}
                            <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                                <div className="text-center font-bold text-xs text-white leading-relaxed break-words">
                                    {question.type === "reading"
                                        ? "Đọc đoạn văn dưới đây và trả lời câu hỏi phụ:"
                                        : question.question?.trim() ||
                                          "Nội dung câu hỏi hiển thị tại đây..."}
                                </div>
                            </div>

                            {/* Question Type Specific Live Previews */}

                            {/* 1. Multiple choice preview */}
                            {question.type === "multiple-choice" && (
                                <div className="grid grid-cols-1 gap-2 pt-2">
                                    {(
                                        (question as MultipleChoiceQuestion)
                                            .options || []
                                    ).map((opt, idx) => {
                                        const letter = String.fromCharCode(
                                            65 + idx
                                        );
                                        const isCorrect = (
                                            question as MultipleChoiceQuestion
                                        ).correctOptionId
                                            ?.split(",")
                                            .includes(opt.id);

                                        return (
                                            <div
                                                key={opt.id}
                                                className={cn(
                                                    "flex items-center gap-2 rounded-xl border p-2.5 transition-all text-left",
                                                    isCorrect
                                                        ? "border-emerald-400 bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                                                        : "border-white/10 bg-white/5"
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0",
                                                        isCorrect
                                                            ? "text-emerald-300 bg-emerald-500/20 border-emerald-500/30"
                                                            : "text-slate-400 bg-slate-800/40 border-white/10"
                                                    )}
                                                >
                                                    {letter}
                                                </span>
                                                <span className="text-[10px] text-slate-200 line-clamp-2 truncate">
                                                    {opt.text?.trim() || (
                                                        <span className="text-slate-600 font-normal italic">
                                                            (Lựa chọn trống)
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* 2. Fill in the blank preview */}
                            {question.type === "fill-in-the-blank" && (
                                <div className="space-y-3 pt-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            disabled
                                            placeholder="Nhập câu trả lời của bạn..."
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl text-[10px] px-3 py-2.5 text-center text-slate-300 pointer-events-none placeholder:text-slate-600"
                                        />
                                    </div>
                                    <div className="text-[9px] text-slate-500 text-center font-mono">
                                        Đáp án chấp nhận:{" "}
                                        <span className="text-emerald-400 font-bold">
                                            {(
                                                question as FillInBlankQuestion
                                            ).answers
                                                ?.filter(Boolean)
                                                .join(", ") || "(Trống)"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* 3. True / False preview */}
                            {question.type === "true-false" && (
                                <div className="flex gap-2.5 justify-center pt-2">
                                    <button
                                        type="button"
                                        className={cn(
                                            "flex-1 py-3 rounded-xl border font-bold text-[10px] transition-all flex flex-col items-center gap-1",
                                            (question as TrueFalseQuestion)
                                                .correctAnswer
                                                ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                                                : "border-white/10 bg-slate-900 text-slate-500 opacity-50"
                                        )}
                                    >
                                        <span className="text-sm">✅</span>
                                        ĐÚNG
                                    </button>
                                    <button
                                        type="button"
                                        className={cn(
                                            "flex-1 py-3 rounded-xl border font-bold text-[10px] transition-all flex flex-col items-center gap-1",
                                            !(question as TrueFalseQuestion)
                                                .correctAnswer
                                                ? "border-rose-400 bg-rose-500/20 text-rose-300 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                                                : "border-white/10 bg-slate-900 text-slate-500 opacity-50"
                                        )}
                                    >
                                        <span className="text-sm">❌</span>
                                        SAI
                                    </button>
                                </div>
                            )}

                            {/* 4. Reading passage preview */}
                            {question.type === "reading" && (
                                <div className="space-y-3 pt-1">
                                    {/* Scrollable Mini Passage */}
                                    <div className="max-h-24 overflow-y-auto border border-white/10 rounded-xl bg-slate-950/60 p-2.5 text-[9px] text-slate-300 leading-relaxed scrollbar-thin">
                                        {(
                                            question as ReadingQuestion
                                        ).passage?.trim() || (
                                            <span className="text-slate-600 italic">
                                                Chưa nhập đoạn văn đọc hiểu...
                                            </span>
                                        )}
                                    </div>

                                    {/* Sub questions indicator */}
                                    {(
                                        (question as ReadingQuestion)
                                            .questions || []
                                    ).length > 0 ? (
                                        <div className="space-y-2 border-t border-white/5 pt-2.5">
                                            {/* Navigation Pills for sub-questions */}
                                            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                                                {(
                                                    (
                                                        question as ReadingQuestion
                                                    ).questions || []
                                                ).map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() =>
                                                            setSelectedSubIndex(
                                                                i
                                                            )
                                                        }
                                                        className={cn(
                                                            "px-2 py-0.5 rounded text-[8px] font-bold shrink-0 transition-all",
                                                            selectedSubIndex ===
                                                                i
                                                                ? "bg-indigo-500 text-white"
                                                                : "bg-white/5 text-slate-400 hover:text-white"
                                                        )}
                                                    >
                                                        Q{i + 1}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Active sub-question card rendering */}
                                            {(() => {
                                                const subQ = (
                                                    question as ReadingQuestion
                                                ).questions[selectedSubIndex];
                                                if (!subQ) return null;

                                                return (
                                                    <div className="p-2 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                                                        <p className="text-[9px] text-slate-200 font-bold leading-tight">
                                                            {subQ.question?.trim() ||
                                                                `(Câu hỏi phụ ${selectedSubIndex + 1} trống)`}
                                                        </p>

                                                        {/* Mini choices inside reading sub */}
                                                        {subQ.type ===
                                                            "multiple-choice" && (
                                                            <div className="grid grid-cols-2 gap-1">
                                                                {(
                                                                    subQ.options ||
                                                                    []
                                                                ).map(
                                                                    (
                                                                        opt,
                                                                        oi
                                                                    ) => {
                                                                        const isCorrect =
                                                                            subQ.correctOptionId ===
                                                                            opt.id;
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    opt.id
                                                                                }
                                                                                className={cn(
                                                                                    "px-1.5 py-1 border rounded text-[7px] text-slate-300 line-clamp-1 truncate font-medium",
                                                                                    isCorrect
                                                                                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                                                                                        : "border-white/5"
                                                                                )}
                                                                            >
                                                                                {String.fromCharCode(
                                                                                    65 +
                                                                                        oi
                                                                                )}

                                                                                .{" "}
                                                                                {opt.text?.trim() ||
                                                                                    "Option"}
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        )}

                                                        {subQ.type ===
                                                            "fill-in-the-blank" && (
                                                            <div className="text-[7px] text-emerald-400 font-mono">
                                                                Đáp án:{" "}
                                                                {subQ.answers
                                                                    ?.filter(
                                                                        Boolean
                                                                    )
                                                                    .join(
                                                                        ", "
                                                                    ) ||
                                                                    "(Trống)"}
                                                            </div>
                                                        )}

                                                        {subQ.type ===
                                                            "true-false" && (
                                                            <div className="text-[7px] font-bold">
                                                                Đáp án đúng:{" "}
                                                                <span
                                                                    className={
                                                                        subQ.correctAnswer
                                                                            ? "text-emerald-400"
                                                                            : "text-rose-400"
                                                                    }
                                                                >
                                                                    {subQ.correctAnswer
                                                                        ? "ĐÚNG"
                                                                        : "SAI"}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        <div className="text-center text-[8px] text-slate-600 italic py-2">
                                            Chưa có câu hỏi phụ
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer UI elements (Bottom Home Bar indicator) */}
                        <div className="h-1 w-24 bg-white/20 rounded-full mx-auto shrink-0 mt-4 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
