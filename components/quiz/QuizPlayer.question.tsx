"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CountdownTimer } from "./CountdownTimer";
import { FlattenedQuestion } from "@/lib/hooks/useQuizEngine";
import { DEFAULT_TIME_PER_QUESTION } from "./QuizPlayer.constants";

interface QuizPlayerQuestionProps {
    currentQuestion: FlattenedQuestion | null;
    currentReadingPassage: string | null;
    currentIndex: number;
    timeRemaining: number;
    questionKey: number;
}

export function QuizPlayerQuestion({
    currentQuestion,
    currentReadingPassage,
    currentIndex,
    timeRemaining,
    questionKey,
}: QuizPlayerQuestionProps) {
    return (
        <div
            className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
            role="main"
            aria-label="Question area"
        >
            {/* Timer - Positioned top right with neon color */}
            <div className="absolute top-0 right-0 sm:top-4 sm:right-4 scale-125 sm:scale-150 transform-gpu z-10">
                <CountdownTimer
                    timeRemaining={timeRemaining}
                    totalTime={DEFAULT_TIME_PER_QUESTION}
                />
            </div>

            <div className="w-full max-w-5xl flex flex-col items-center text-center px-4 sm:px-6">
                {/* Reading Passage - Dark card with bright text */}
                <AnimatePresence mode="wait">
                    {currentReadingPassage && (
                        <motion.div
                            key={`passage-${currentIndex}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8 bg-[#2d1b4e]/80 rounded-2xl sm:rounded-[32px] border border-[#00d4ff]/30 max-h-[25vh] overflow-y-auto text-lg sm:text-xl lg:text-2xl text-[#e0e0ff] leading-relaxed shadow-[0_0_30px_rgba(0,212,255,0.1)] backdrop-blur-sm"
                            role="region"
                            aria-label="Reading passage"
                        >

                            <span className="text-[#00d4ff] font-bold uppercase text-sm sm:text-base block mb-3 tracking-wider">Ngữ cảnh bài đọc:</span>
                            <p className="text-[#f0f0ff] font-medium">{currentReadingPassage}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Question - Large bright text with neon glow */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={questionKey}
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                            mass: 0.8
                        }}
                        className="w-full"
                        role="region"
                        aria-label="Question"
                    >
                        {currentQuestion && (
                            <h2
                                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.2] tracking-tight text-white drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]"
                                role="heading"
                                aria-level={2}
                            >
                                {currentQuestion.question}
                            </h2>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
