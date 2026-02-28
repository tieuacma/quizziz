"use client";

import { FillBlankQuestion } from "@/lib/types/quiz";
import { Input } from "@/components/ui/input";
import { ValidationError } from "@/lib/types/validation";

interface FillBlankEditorProps {
    question: FillBlankQuestion;
    errors?: ValidationError[];
    onUpdate: (updates: Partial<FillBlankQuestion>) => void;
}

export function FillBlankEditor({ question, errors = [], onUpdate }: FillBlankEditorProps) {
    const questionError = errors.find(e => e.field === "question");
    const correctAnswerError = errors.find(e => e.field === "correctAnswer");

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nội dung câu hỏi
                </label>
                <textarea
                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-transparent min-h-[60px] resize-none focus:outline-none focus:ring-2 transition-colors ${questionError
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-purple-500 border-slate-200"
                        }`}
                    placeholder="Nhập câu hỏi (sử dụng ___ để đánh dấu vị trí điền)..."
                    value={question.question}
                    onChange={(e) => onUpdate({ question: e.target.value })}
                />
                {questionError && (
                    <p className="text-red-500 text-xs mt-1">{questionError.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Đáp án đúng
                </label>
                <Input
                    className={`transition-colors ${correctAnswerError ? "border-red-500 focus:border-red-500" : ""
                        }`}
                    placeholder="Nhập đáp án đúng..."
                    value={question.correctAnswer}
                    onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
                />
                {correctAnswerError && (
                    <p className="text-red-500 text-xs mt-1">{correctAnswerError.message}</p>
                )}
            </div>
        </div>
    );
}
