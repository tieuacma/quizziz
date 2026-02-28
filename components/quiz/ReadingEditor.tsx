"use client";

import { ReadingQuestion, ReadingSubQuestion, MultipleChoiceOption } from "@/lib/types/quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { ValidationError } from "@/lib/types/validation";

interface ReadingEditorProps {
    question: ReadingQuestion;
    errors?: ValidationError[];
    onUpdate: (updates: Partial<ReadingQuestion>) => void;
    onAddSubQ: (type: "multiple_choice" | "fill_blank") => void;
    onUpdateSubQ: (subQId: string, updates: Partial<ReadingSubQuestion>) => void;
    onDeleteSubQ: (subQId: string) => void;
}

export function ReadingEditor({
    question,
    errors = [],
    onUpdate,
    onAddSubQ,
    onUpdateSubQ,
    onDeleteSubQ,
}: ReadingEditorProps) {
    const contextError = errors.find(e => e.field === "context");
    const subQuestionsError = errors.find(e => e.field === "subQuestions");

    // Get errors for sub-questions
    const subQErrors = errors.filter(e => e.questionId !== question.id);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bài đọc / Đoạn văn
                </label>
                <textarea
                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-transparent min-h-[120px] resize-none focus:outline-none focus:ring-2 transition-colors ${contextError
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-purple-500 border-slate-200"
                        }`}
                    placeholder="Nhập nội dung bài đọc..."
                    value={question.context}
                    onChange={(e) => onUpdate({ context: e.target.value })}
                />
                {contextError && (
                    <p className="text-red-500 text-xs mt-1">{contextError.message}</p>
                )}
            </div>

            <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">
                        Câu hỏi phụ ({question.subQuestions.length})
                    </label>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddSubQ("multiple_choice")}
                        >
                            <Plus size={14} className="mr-1" />
                            Trắc nghiệm
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddSubQ("fill_blank")}
                        >
                            <Plus size={14} className="mr-1" />
                            Điền ô trống
                        </Button>
                    </div>
                </div>

                {subQuestionsError && (
                    <p className="text-red-500 text-xs mb-2">{subQuestionsError.message}</p>
                )}

                {question.subQuestions.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">
                        Chưa có câu hỏi phụ. Thêm câu hỏi bên trên.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {question.subQuestions.map((subQ: any, idx: number) => {
                            const subQError = subQErrors.find(e => e.questionId === subQ.id);

                            return (
                                <div
                                    key={subQ.id}
                                    className="bg-slate-50 rounded-lg p-3 border"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-600">
                                                Câu hỏi phụ {idx + 1}
                                            </span>
                                            <Badge variant="outline" className="text-xs">
                                                {subQ.type === "multiple_choice"
                                                    ? "Trắc nghiệm"
                                                    : "Điền ô trống"}
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-red-500"
                                            onClick={() => onDeleteSubQ(subQ.id)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>

                                    {subQ.type === "multiple_choice" && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Nội dung câu hỏi
                                                </label>
                                                <textarea
                                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-transparent min-h-[60px] resize-none focus:outline-none focus:ring-2 transition-colors focus:ring-purple-500 border-slate-200"
                                                    placeholder="Nhập nội dung câu hỏi..."
                                                    value={subQ.question}
                                                    onChange={(e) =>
                                                        onUpdateSubQ(subQ.id, { question: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-slate-700">
                                                    Các lựa chọn
                                                </label>
                                                {(subQ.options || []).map((option: MultipleChoiceOption, idx: number) => {
                                                    const letter = String.fromCharCode(65 + idx); // A B C D
                                                    const isCorrect = subQ.correctOptionId === option.id;
                                                    return (
                                                        <div key={option.id} className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isCorrect
                                                                    ? "bg-green-500 text-white hover:bg-green-600"
                                                                    : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                                                                    }`}
                                                                onClick={() =>
                                                                    onUpdateSubQ(subQ.id, { correctOptionId: option.id })
                                                                }
                                                            >
                                                                {isCorrect && <CheckCircle2 size={14} />}
                                                            </button>
                                                            <span className="text-sm font-medium text-slate-600 w-6">
                                                                {letter}.
                                                            </span>
                                                            <Input
                                                                className="flex-1 transition-colors"
                                                                placeholder={`Lựa chọn ${letter}`}
                                                                value={option.text}
                                                                onChange={(e) => {
                                                                    const newOptions = [...subQ.options];
                                                                    newOptions[idx] = {
                                                                        ...newOptions[idx],
                                                                        text: e.target.value,
                                                                    };
                                                                    onUpdateSubQ(subQ.id, { options: newOptions });
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {subQ.type === "fill_blank" && (
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Nội dung câu hỏi..."
                                                value={subQ.question}
                                                onChange={(e) =>
                                                    onUpdateSubQ(subQ.id, { question: e.target.value })
                                                }
                                            />
                                            <Input
                                                placeholder="Đáp án đúng..."
                                                value={subQ.correctAnswer}
                                                onChange={(e) =>
                                                    onUpdateSubQ(subQ.id, { correctAnswer: e.target.value })
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
