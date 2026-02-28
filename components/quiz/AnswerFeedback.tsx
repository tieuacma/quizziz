"use client";

import { CheckCircle, XCircle, Star, Sparkles } from "lucide-react";

interface AnswerFeedbackProps {
    isCorrect: boolean;
    pointsEarned: number;
    correctAnswer: string;
    userAnswer: string;
}

export function AnswerFeedback({
    isCorrect,
    pointsEarned,
    correctAnswer,
    userAnswer,
}: AnswerFeedbackProps) {
    return (
        <div className={`
            mt-6 p-4 rounded-lg border-2 animate-in fade-in slide-in-from-bottom-4 duration-300
            ${isCorrect
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }
        `}>
            <div className="flex items-start gap-4">
                {isCorrect ? (
                    <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                ) : (
                    <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                )}

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className={`
                            font-bold text-lg
                            ${isCorrect ? "text-green-700" : "text-red-700"}
                        `}>
                            {isCorrect ? "Chính xác!" : "Chưa đúng!"}
                        </h3>
                        {isCorrect && pointsEarned > 0 && (
                            <div className="flex items-center gap-1 text-yellow-600">
                                <Star className="w-5 h-5 fill-yellow-500" />
                                <span className="font-bold">+{pointsEarned}</span>
                            </div>
                        )}
                    </div>

                    {!isCorrect && (
                        <div className="text-sm">
                            <span className="text-red-600 font-medium">Đáp án đúng: </span>
                            <span className="text-red-700 font-bold">{correctAnswer}</span>
                        </div>
                    )}

                    {isCorrect && pointsEarned > 1000 && (
                        <div className="mt-2 inline-flex items-center gap-1 text-purple-600 bg-purple-100 px-3 py-1 rounded-full text-sm">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-medium">Bonus Streak!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
