"use client";

import { MultipleChoiceQuestion } from "@/lib/types/quiz";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { ValidationError } from "@/lib/types/validation";

interface MultipleChoiceEditorProps {
    question: MultipleChoiceQuestion;
    errors?: ValidationError[];
    onUpdate: (updates: Partial<MultipleChoiceQuestion>) => void;
}

export function MultipleChoiceEditor({ question, errors = [], onUpdate }: MultipleChoiceEditorProps) {
    // Check for specific field errors
    const questionError = errors.find(e => e.field === "question");
    const optionsError = errors.find(e => e.field === "options");
    const correctOptionError = errors.find(e => e.field === "correctOptionId");

    return (
        <div className="space-y-4">
            {/* Question content */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nội dung câu hỏi
                </label>
                <textarea
                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-transparent min-h-[60px] resize-none focus:outline-none focus:ring-2 transition-colors ${questionError
                            ? "border-red-500 focus:ring-red-500"
                            : "focus:ring-purple-500 border-slate-200"
                        }`}
                    placeholder="Nhập nội dung câu hỏi..."
                    value={question.question}
                    onChange={(e) => onUpdate({ question: e.target.value })}
                />
                {questionError && (
                    <p className="text-red-500 text-xs mt-1">{questionError.message}</p>
                )}
            </div>

            {/* Options */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                    Các lựa chọn
                </label>

                {question.options.map((option, idx) => {
                    const letter = String.fromCharCode(65 + idx); // A B C D
                    const isCorrect = question.correctOptionId === option.id;
                    const optionError = errors.find(e => e.field === `options[${idx}]`);

                    return (
                        <div key={option.id} className="flex items-center gap-2">
                            {/* Select correct */}
                            <button
                                type="button"
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isCorrect
                                        ? "bg-green-500 text-white hover:bg-green-600"
                                        : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                                    }`}
                                onClick={() =>
                                    onUpdate({ correctOptionId: option.id })
                                }
                            >
                                {isCorrect && <CheckCircle2 size={14} />}
                            </button>

                            {/* Letter */}
                            <span className="text-sm font-medium text-slate-600 w-6">
                                {letter}.
                            </span>

                            {/* Option text */}
                            <Input
                                className={`flex-1 transition-colors ${optionError ? "border-red-500 focus:border-red-500" : ""
                                    }`}
                                placeholder={`Lựa chọn ${letter}`}
                                value={option.text}
                                onChange={(e) => {
                                    const newOptions = [...question.options];
                                    newOptions[idx] = {
                                        ...newOptions[idx],
                                        text: e.target.value,
                                    };

                                    onUpdate({ options: newOptions });
                                }}
                            />
                        </div>
                    );
                })}

                {optionsError && (
                    <p className="text-red-500 text-xs mt-1">{optionsError.message}</p>
                )}
                {correctOptionError && (
                    <p className="text-red-500 text-xs mt-1">{correctOptionError.message}</p>
                )}
            </div>
        </div>
    );
}
