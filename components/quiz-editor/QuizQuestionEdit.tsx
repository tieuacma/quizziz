"use client";

import { QuizQuestion } from "@/types/quiz";
import QuestionEditor from "@/components/quiz-create/QuestionEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function QuizQuestionEdit({
    question,
    defaultTime,
    onChange,
}: {
    question: QuizQuestion;
    defaultTime: number;
    onChange: (q: QuizQuestion) => void;
}) {
    return (
        <div>
            <QuestionEditor question={question} onChange={onChange} />

            <div className="mt-4 pt-4 border-t border-slate-800">
                <Label className="text-xs text-slate-400 mb-2 block">
                    Thời gian riêng (giây)
                </Label>
                <Input
                    type="number"
                    value={question.timeLimit}
                    onChange={(e) =>
                        onChange({
                            ...question,
                            timeLimit: parseInt(e.target.value) || defaultTime,
                        })
                    }
                    className="w-24"
                    min="5"
                    max="300"
                />
            </div>
        </div>
    );
}
