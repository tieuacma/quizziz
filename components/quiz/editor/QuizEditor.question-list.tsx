"use client";

import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Question, ReadingSubQuestion } from "@/lib/types/quiz";
import { ValidationError } from "@/lib/types/validation";

interface QuizEditorQuestionListProps {
    questions: Question[];
    errors?: ValidationError[];
    onUpdate: (questionId: string, updates: Partial<Question>) => void;
    onDelete: (questionId: string) => void;
    onAddSubQ: (readingId: string, type: "multiple_choice" | "fill_blank") => void;
    onUpdateSubQ: (readingId: string, subQId: string, updates: Partial<ReadingSubQuestion>) => void;
    onDeleteSubQ: (readingId: string, subQId: string) => void;
}

export function QuizEditorQuestionList({
    questions,
    errors = [],
    onUpdate,
    onDelete,
    onAddSubQ,
    onUpdateSubQ,
    onDeleteSubQ,
}: QuizEditorQuestionListProps) {
    if (questions.length === 0) {
        return (
            <Card className="rounded-2xl">
                <CardContent className="py-12 text-center">
                    <FileText size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 mb-4">Chưa có câu hỏi nào</p>
                    <p className="text-sm text-slate-400">Nhấn vào nút bên trên để thêm câu hỏi</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {questions.map((question, index) => (
                <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    errors={errors}
                    onUpdate={(updates) => onUpdate(question.id, updates)}
                    onDelete={() => onDelete(question.id)}
                    onAddSubQ={(type) => onAddSubQ(question.id, type)}
                    onUpdateSubQ={(subQId, updates) => onUpdateSubQ(question.id, subQId, updates)}
                    onDeleteSubQ={(subQId) => onDeleteSubQ(question.id, subQId)}
                />
            ))}
        </div>
    );
}
