// app/quiz/[id]/page.tsx
"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useQuizEditor } from "@/components/quiz/editor/useQuizEditor";
import { QuizEditorToolbar } from "@/components/quiz/editor/QuizEditor.toolbar";
import { QuizEditorQuestionList } from "@/components/quiz/editor/QuizEditor.question-list";
import { QuestionType } from "@/components/quiz/editor/QuizEditor.constants";
import { ValidationError } from "@/lib/types/validation";
import { validateQuiz } from "@/components/quiz/editor/QuizEditor.validators";

export default function QuizEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        quiz,
        isLoading,
        isSaving,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        addSubQuestion,
        updateSubQuestion,
        deleteSubQuestion,
        saveQuiz,
    } = useQuizEditor({ quizId: resolvedParams.id });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-slate-500 font-medium">Đang tải...</div>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return null;
    }

    const handleSaveQuiz = async () => {
        // Clear previous errors
        setErrors([]);
        setShowSuccess(false);

        // Validate quiz (pass quiz.questions which is Question[])
        const validationResult = validateQuiz(quiz.questions);

        if (!validationResult.isValid) {
            // Set errors and scroll to first error
            setErrors(validationResult.errors);

            // Scroll to first error question
            if (validationResult.firstErrorQuestionId) {
                const element = document.getElementById(`question-${validationResult.firstErrorQuestionId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            return;
        }

        // If validation passes, save the quiz
        await saveQuiz();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 px-8 py-4 shadow-sm">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center text-slate-500 hover:text-purple-600 transition-colors group"
                            >
                                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Dashboard</span>
                            </Link>
                            <div className="h-8 w-px bg-slate-200"></div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{quiz.title}</h1>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                                        {quiz.subject}
                                    </Badge>
                                    <Badge variant="outline" className="bg-slate-50 text-slate-600">
                                        {quiz.questions.length} câu hỏi
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Success Message */}
                            {showSuccess && (
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg animate-fade-in">
                                    <CheckCircle size={18} />
                                    <span className="text-sm font-medium">Lưu thành công!</span>
                                </div>
                            )}

                            {/* Error Summary */}
                            {errors.length > 0 && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                                    <AlertCircle size={18} />
                                    <span className="text-sm font-medium">{errors.length} lỗi cần sửa</span>
                                </div>
                            )}

                            <Button
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200"
                                onClick={handleSaveQuiz}
                                disabled={isSaving}
                            >
                                <Save size={18} className="mr-2" />
                                {isSaving ? "Đang lưu..." : "Lưu Quiz"}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col w-full p-6">
                <div className="max-w-5xl mx-auto w-full space-y-6">
                    {/* Toolbar */}
                    <QuizEditorToolbar onAddQuestion={addQuestion as (type: QuestionType) => void} />

                    {/* Questions List */}
                    <QuizEditorQuestionList
                        questions={quiz.questions}
                        errors={errors}
                        onUpdate={updateQuestion}
                        onDelete={deleteQuestion}
                        onAddSubQ={addSubQuestion}
                        onUpdateSubQ={updateSubQuestion}
                        onDeleteSubQ={deleteSubQuestion}
                    />
                </div>
            </main>
        </div>
    );
}
