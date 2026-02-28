"use client";

import { FlattenedQuestion } from "@/lib/hooks/useQuizEngine";
import { Card } from "@/components/ui/card";

interface QuestionDisplayProps {
    question: FlattenedQuestion;
    selectedAnswer: string;
    onSelectAnswer: (answer: string) => void;
    disabled?: boolean;
}

export function QuestionDisplay({
    question,
    selectedAnswer,
    onSelectAnswer,
    disabled = false,
}: QuestionDisplayProps) {
    // Multiple Choice
    if (question.type === "multiple_choice" && question.options) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    {question.question}
                </h2>

                <div className="grid gap-3">
                    {question.options.map((option, index) => {
                        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                        const isSelected = selectedAnswer === optionLetter;

                        return (
                            <button
                                key={index}
                                onClick={() => onSelectAnswer(optionLetter)}
                                disabled={disabled}
                                className={`
                                    w-full p-4 rounded-lg border-2 text-left font-medium transition-all duration-200
                                    ${isSelected
                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                                    }
                                    ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                                `}
                            >
                                <span className={`
                                    inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-bold
                                    ${isSelected
                                        ? "bg-purple-500 text-white"
                                        : "bg-gray-200 text-gray-600"
                                    }
                                `}>
                                    {optionLetter}
                                </span>
                                {option.text}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Fill in the Blank
    if (question.type === "fill_blank") {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    {question.question}
                </h2>

                <div className="flex flex-col gap-2">
                    <label htmlFor="fill-blank-answer" className="text-sm font-medium text-gray-600">
                        Nhập đáp án của bạn:
                    </label>
                    <input
                        id="fill-blank-answer"
                        type="text"
                        value={selectedAnswer}
                        onChange={(e) => onSelectAnswer(e.target.value)}
                        disabled={disabled}
                        placeholder="Nhập đáp án..."
                        className={`
                            w-full p-4 rounded-lg border-2 text-lg transition-all duration-200
                            ${selectedAnswer
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-200 focus:border-purple-500 focus:bg-purple-50"
                            }
                            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
                        `}
                    />
                </div>
            </div>
        );
    }

    // Default fallback
    return (
        <div className="text-center text-gray-500">
            Unknown question type
        </div>
    );
}
