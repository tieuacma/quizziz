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

            <div className="w-full max-w-7xl h-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8 items-start">
                {/* LEFT: Fixed Reading Context */}
                <AnimatePresence mode="wait">
                    {currentReadingPassage && currentQuestion?.isSubQuestion && (
                        <motion.div
                            key={`passage-${currentIndex}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="lg:h-[70vh] p-6 lg:p-8 bg-[#2d1b4e]/80 rounded-3xl border border-[#00d4ff]/30 overflow-y-auto text-xl lg:text-2xl text-[#e0e0ff] leading-relaxed shadow-[0_0_30px_rgba(0,212,255,0.2)] backdrop-blur-sm sticky top-4 self-start"
                            role="complementary"
                            aria-label="Reading passage"
                        >
                            <span className="text-[#00d4ff] font-bold uppercase text-base block mb-4 tracking-wider">📖 Ngữ cảnh bài đọc:</span>
                            <p className="font-medium whitespace-pre-wrap">{currentReadingPassage}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* RIGHT: SubQuestions Slide */}
                <div className="flex flex-col h-full lg:h-[70vh] justify-between">
                    {/* Subquestion Indicator (if reading) */}
                    {currentQuestion?.isSubQuestion && currentReadingPassage && (
                        <div className="flex items-center gap-2 mb-6 self-center lg:self-start">
                            <span className="text-sm text-[#00d4ff]/70 font-medium">Câu {currentIndex + 1}/5</span>
                        </div>
                    )}

                    {/* Question Area with Slide Motion */}
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
                            className="flex-1 flex flex-col justify-center"
                        >
                            {currentQuestion && (
                                <h2
                                    className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.2] tracking-tight text-white drop-shadow-[0_0_25px_rgba(0,212,255,0.6)] text-center lg:text-left"
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
        </div>
    );
}
