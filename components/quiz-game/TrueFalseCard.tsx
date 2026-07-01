"use client";

import React, { useState, useRef, useCallback } from "react";

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
import { useParticleEffect } from "./ParticleSystem";

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
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const { triggerEffect } = useParticleEffect();

    const handleSelect = useCallback(
        (value: boolean, index: number) => {
            if (submitted) return;
            setSelected(value);
            setSubmitted(true);
            const isCorrect = value === question.correctAnswer;

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
        [submitted, question.correctAnswer, triggerEffect, onAnswer]
    );

    const options = [
        { value: true, label: quizGameCopy.trueFalse.true },
        { value: false, label: quizGameCopy.trueFalse.false },
    ] as const;

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="h-1/2 flex items-center justify-center p-4">
                <motion.h2
                    className="font-display text-4xl md:text-5xl font-extrabold text-center leading-tight px-4 max-w-4xl zenith-gradient-text text-neon-glow-violet"
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
                        const isCorrect =
                            submitted && value === question.correctAnswer;
                        const isWrong = submitted && isSelected && !isCorrect;

                        return (
                            <motion.button
                                key={String(value)}
                                type="button"
                                ref={(el) => {
                                    buttonRefs.current[index] = el;
                                }}
                                variants={optionItemVariants}
                                onClick={() => handleSelect(value, index)}
                                disabled={submitted}
                                className={cn(
                                    "h-full min-h-[64px] sm:min-h-[120px] rounded-3xl border font-bold text-2xl flex items-center justify-center p-6 transition-all duration-300 relative overflow-hidden",
                                    "border-white/10 bg-white/5",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                                    value === true &&
                                        !submitted &&
                                        !isSelected &&
                                        "hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:shadow-[0_0_15px_rgba(52,211,153,0.15)]",
                                    value === false &&
                                        !submitted &&
                                        !isSelected &&
                                        "hover:border-rose-500/50 hover:bg-rose-500/5 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]",
                                    !submitted &&
                                        isSelected &&
                                        (value === true
                                            ? "neon-border-emerald bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                                            : "neon-border-rose bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.3)]"),
                                    isCorrect &&
                                        "neon-border-emerald bg-emerald-500/20 shadow-[0_0_25px_rgba(52,211,153,0.4)]",
                                    isWrong &&
                                        "neon-border-rose bg-rose-500/20 shadow-[0_0_25px_rgba(244,63,94,0.4)] card-shake"
                                )}
                                whileHover={
                                    submitted ? { scale: 1 } : { scale: 1.02 }
                                }
                                whileTap={
                                    submitted ? { scale: 1 } : { scale: 0.98 }
                                }
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
                                                ? value === true
                                                    ? "text-emerald-300 bg-emerald-500/20 border-emerald-500/40 text-neon-glow-emerald"
                                                    : "text-rose-300 bg-rose-500/20 border-rose-500/40 text-neon-glow-rose"
                                                : "text-slate-400 bg-slate-800/40 border-white/10"
                                    )}
                                >
                                    {index === 0 ? "A" : "B"}
                                </span>

                                <span className="text-center leading-relaxed z-10 flex items-center gap-2">
                                    <span>{value ? "✅" : "❌"}</span>
                                    <span>{label}</span>
                                </span>
                                {isCorrect && (
                                    <CheckCircle className="absolute top-3 right-3 w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                )}
                                {isWrong && (
                                    <XCircle className="absolute top-3 right-3 w-8 h-8 text-red-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}
