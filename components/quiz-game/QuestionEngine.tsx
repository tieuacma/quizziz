"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
    QuizQuestion,
    QuizState,
    ReadingQuestion,
    MultipleChoiceQuestion,
    FillInBlankQuestion,
    TrueFalseQuestion,
} from "@/types/quiz";
import MultiChoiceCard from "./MultiChoiceCard";
import ReadingCard from "./ReadingCard";
import FillBlankCard from "./FillBlankCard";
import TrueFalseCard from "./TrueFalseCard";
import { quizGameCopy } from "./copy";
import { useQuestionMotion } from "./motion";

interface QuestionEngineProps {
    question?: QuizQuestion;
    questionKey: string;
    quizState: QuizState & { currentSubQuestionIndex: number };
    handleAnswer: (isCorrect: boolean) => void;
    handleSubQuestionAnswer?: (subId: string, answer: string) => void;
    handleCompleteReading?: (question: ReadingQuestion) => void;
    readingSubAnswers: Record<string, string>;
    isReadingQuestionComplete: (question?: QuizQuestion) => boolean;
}

export default function QuestionEngine({
    question,
    questionKey,
    quizState,
    handleAnswer,
    handleSubQuestionAnswer,
    handleCompleteReading,
    readingSubAnswers,
    isReadingQuestionComplete,
}: QuestionEngineProps) {
    const { variants, transition } = useQuestionMotion();

    const renderQuestionContent = (q: QuizQuestion) => {
        switch (q.type) {
            case "multiple-choice":
                return (
                    <MultiChoiceCard
                        question={q as MultipleChoiceQuestion}
                        onAnswer={handleAnswer}
                        eraserActive={quizState.powerups?.active.eraser}
                    />
                );
            case "fill-in-the-blank":
                return (
                    <FillBlankCard
                        question={q as FillInBlankQuestion}
                        onAnswer={handleAnswer}
                    />
                );
            case "true-false":
                return (
                    <TrueFalseCard
                        question={q as TrueFalseQuestion}
                        onAnswer={handleAnswer}
                    />
                );
            case "reading":
                return (
                    <ReadingCard
                        question={q as ReadingQuestion}
                        onSubAnswer={handleSubQuestionAnswer!}
                        onComplete={handleCompleteReading!}
                        readingSubAnswers={readingSubAnswers}
                        currentSubQuestionIndex={
                            quizState.currentSubQuestionIndex ?? 0
                        }
                        isReadingQuestionComplete={() =>
                            isReadingQuestionComplete(q)
                        }
                    />
                );
            default:
                return (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                        {quizGameCopy.unsupported(
                            (q as QuizQuestion).type ?? "unknown"
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="w-full h-full overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
                {question ? (
                    <motion.div
                        key={questionKey}
                        className="w-full h-full flex flex-col"
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {renderQuestionContent(question)}
                    </motion.div>
                ) : (
                    <motion.div
                        key="loading"
                        className="w-full h-full flex items-center justify-center bg-black/50 text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {quizGameCopy.loading}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
