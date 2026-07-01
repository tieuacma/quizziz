"use client";

import React, { useState, useRef, useCallback } from "react";

import { motion } from "framer-motion";
import type { FillInBlankQuestion } from "@/types/quiz";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { gradeFillBlank } from "@/lib/quiz-game/grade";
import { quizGameCopy } from "./copy";
import { QUESTION_FEEDBACK_MS } from "./motion";
import { useParticleEffect } from "./ParticleSystem";

interface FillBlankCardProps {
    question: FillInBlankQuestion;
    onAnswer: (isCorrect: boolean) => void;
}

export default function FillBlankCard({
    question,
    onAnswer,
}: FillBlankCardProps) {
    const [userAnswer, setUserAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { triggerEffect } = useParticleEffect();

    const checkAnswer = useCallback(() => {
        if (submitted || !userAnswer.trim()) return;

        const match = gradeFillBlank(
            question.answers,
            userAnswer,
            question.caseSensitive
        );

        setIsCorrect(match);
        setSubmitted(true);

        // Trigger particle effect at input position
        const element = inputRef.current || buttonRef.current;
        if (element) {
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            triggerEffect(match ? "correct" : "wrong", x, y);
        }

        setTimeout(() => onAnswer(match), QUESTION_FEEDBACK_MS);
    }, [submitted, userAnswer, question, triggerEffect, onAnswer]);

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 gap-8">
                <motion.h2
                    className="font-display text-3xl md:text-5xl font-extrabold text-center leading-tight max-w-4xl zenith-gradient-text text-neon-glow-violet"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {question.question}
                </motion.h2>

                <div className="w-full max-w-2xl relative">
                    <Input
                        ref={inputRef}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                        placeholder={quizGameCopy.fillBlank.placeholder}
                        className="w-full min-h-[72px] h-20 md:h-24 text-2xl md:text-3xl text-center rounded-[24px] border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-violet-400 hover:border-violet-500/30 transition-all duration-300 focus-visible:shadow-[0_0_20px_rgba(167,139,250,0.25)]"
                        disabled={submitted}
                        aria-label={quizGameCopy.fillBlank.placeholder}
                    />
                    {submitted && (
                        <motion.div
                            className={cn(
                                "absolute inset-0 flex items-center justify-center rounded-[24px] z-10 border backdrop-blur-md",
                                isCorrect
                                    ? "neon-border-emerald bg-emerald-500/25 shadow-[0_0_30px_rgba(52,211,153,0.4)]"
                                    : "neon-border-rose bg-rose-500/25 shadow-[0_0_30px_rgba(244,63,94,0.4)] card-shake"
                            )}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            {isCorrect ? (
                                <CheckCircle className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)] animate-pulse" />
                            ) : (
                                <XCircle className="w-16 h-16 text-red-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]" />
                            )}
                        </motion.div>
                    )}
                </div>

                {!submitted ? (
                    <Button
                        ref={buttonRef}
                        size="lg"
                        className="zenith-btn-glow min-h-11 h-14 px-12 text-xl font-extrabold rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-0 relative overflow-hidden group shadow-[0_0_20px_rgba(167,139,250,0.3)] hover:shadow-[0_0_30px_rgba(167,139,250,0.55)]"
                        onClick={checkAnswer}
                        disabled={!userAnswer.trim()}
                    >
                        {/* Animated shine effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        {quizGameCopy.fillBlank.submit}
                    </Button>
                ) : (
                    <p
                        className={cn(
                            "text-2xl font-black uppercase tracking-wider",
                            isCorrect
                                ? "text-emerald-400 text-neon-glow-emerald"
                                : "text-rose-400 text-neon-glow-rose"
                        )}
                    >
                        {isCorrect
                            ? quizGameCopy.fillBlank.correct
                            : quizGameCopy.fillBlank.wrong}
                    </p>
                )}
            </div>
        </div>
    );
}
