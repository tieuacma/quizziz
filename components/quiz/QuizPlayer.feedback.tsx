"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FloatingScore } from "./FloatingScore";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizPlayerFeedbackProps {
    showFeedback: boolean;
    isCorrect: boolean;
    pointsEarned: number;
    correctAnswer?: string;
    showFloatingScore: boolean;
    floatingPoints: number;
}

export function QuizPlayerFeedback({
    showFeedback,
    isCorrect,
    pointsEarned,
    correctAnswer,
    showFloatingScore,
    floatingPoints,
}: QuizPlayerFeedbackProps) {
    return (
        <AnimatePresence mode="wait">
            {showFeedback && (
                <motion.div
                    key="feedback-indicator"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", damping: 22, stiffness: 250 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-30"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <div
                        className={`
                            flex items-center gap-3 px-6 py-3 rounded-full shadow-lg border-2
                            ${isCorrect
                                ? "bg-[#00ff88]/90 border-[#00ff88] shadow-[0_0_30px_rgba(0,255,136,0.5)]"
                                : "bg-[#ff3366]/90 border-[#ff3366] shadow-[0_0_30px_rgba(255,51,102,0.5)]"}
                        `}
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 12 }}
                        >
                            {isCorrect ? (
                                <CheckCircle className="w-6 h-6 text-white" aria-hidden="true" />
                            ) : (
                                <XCircle className="w-6 h-6 text-white" aria-hidden="true" />
                            )}
                        </motion.div>

                        {/* Text */}
                        <motion.div
                            animate={
                                isCorrect
                                    ? { scale: [1, 1.05, 1] }
                                    : { x: [0, -4, 4, -4, 4, 0] }
                            }
                            transition={{ duration: 0.4 }}
                            className="text-white font-bold text-lg"
                        >
                            {isCorrect ? (
                                `+${pointsEarned} điểm!`
                            ) : (
                                <div className="flex flex-col text-sm leading-tight">
                                    <span className="font-semibold">Sai rồi!</span>
                                    {correctAnswer && (
                                        <span className="font-normal opacity-95">
                                            Đáp án đúng:{" "}
                                            <span className="font-bold">
                                                {correctAnswer}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Floating Score */}
                    <FloatingScore
                        points={floatingPoints}
                        isVisible={showFloatingScore}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
