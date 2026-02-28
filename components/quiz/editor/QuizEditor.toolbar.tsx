"use client";

import { Button } from "@/components/ui/button";
import { QUESTION_TYPES, QuestionType } from "./QuizEditor.constants";

interface QuizEditorToolbarProps {
    onAddQuestion: (type: QuestionType) => void;
}

export function QuizEditorToolbar({ onAddQuestion }: QuizEditorToolbarProps) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-slate-600 mr-1">Thêm câu hỏi:</span>
                {Object.entries(QUESTION_TYPES).map(([type, config]) => (
                    <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => onAddQuestion(type as QuestionType)}
                        className="gap-2 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
                    >
                        <config.icon size={16} />
                        {config.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
