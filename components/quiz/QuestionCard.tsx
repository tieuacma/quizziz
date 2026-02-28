"use client";

import { useState } from "react";
import { Question, ReadingSubQuestion } from "@/lib/types/quiz";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { GripVertical, Trash2, ListChecks, Type, BookOpen } from "lucide-react";
import { MultipleChoiceEditor } from "./MultipleChoiceEditor";
import { FillBlankEditor } from "./FillBlankEditor";
import { ReadingEditor } from "./ReadingEditor";
import { ValidationError } from "@/lib/types/validation";

interface QuestionCardProps {
    question: Question;
    index: number;
    errors?: ValidationError[];
    onUpdate: (updates: Partial<Question>) => void;
    onDelete: () => void;
    onAddSubQ: (type: "multiple_choice" | "fill_blank") => void;
    onUpdateSubQ: (subQId: string, updates: Partial<ReadingSubQuestion>) => void;
    onDeleteSubQ: (subQId: string) => void;
}

const QUESTION_TYPES = {
    multiple_choice: {
        label: "Trắc nghiệm",
        icon: ListChecks,
        color: "bg-blue-100 text-blue-600",
    },
    fill_blank: {
        label: "Điền ô trống",
        icon: Type,
        color: "bg-green-100 text-green-600",
    },
    reading: {
        label: "Bài đọc",
        icon: BookOpen,
        color: "bg-purple-100 text-purple-600",
    },
};

export function QuestionCard({
    question,
    index,
    errors = [],
    onUpdate,
    onDelete,
    onAddSubQ,
    onUpdateSubQ,
    onDeleteSubQ,
}: QuestionCardProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const typeConfig = QUESTION_TYPES[question.type];

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        onDelete();
        setShowDeleteModal(false);
    };

    // Get errors for this question
    const questionErrors = errors.filter(e => e.questionId === question.id);

    return (
        <>
            <Card
                id={`question-${question.id}`}
                className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow duration-200 rounded-2xl"
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-slate-400 cursor-grab">
                                <GripVertical size={20} />
                            </div>
                            <span className="text-lg font-semibold text-slate-700">
                                Câu {index + 1}
                            </span>
                            <Badge className={typeConfig.color}>
                                <typeConfig.icon size={12} className="mr-1" />
                                {typeConfig.label}
                            </Badge>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            onClick={handleDelete}
                        >
                            <Trash2 size={18} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Multiple Choice */}
                    {question.type === "multiple_choice" && (
                        <MultipleChoiceEditor
                            question={question}
                            errors={questionErrors}
                            onUpdate={onUpdate}
                        />
                    )}

                    {/* Fill in Blank */}
                    {question.type === "fill_blank" && (
                        <FillBlankEditor
                            question={question}
                            errors={questionErrors}
                            onUpdate={onUpdate}
                        />
                    )}

                    {/* Reading */}
                    {question.type === "reading" && (
                        <ReadingEditor
                            question={question}
                            errors={questionErrors}
                            onUpdate={onUpdate}
                            onAddSubQ={onAddSubQ}
                            onUpdateSubQ={onUpdateSubQ}
                            onDeleteSubQ={onDeleteSubQ}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
                title="Xác nhận xoá"
                description="Bạn có chắc chắn muốn xoá câu hỏi này không?"
                confirmText="Chắc chắn"
                cancelText="Huỷ"
                variant="destructive"
                onConfirm={confirmDelete}
            />
        </>
    );
}
