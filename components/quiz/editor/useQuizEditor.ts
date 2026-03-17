// app/components/quiz/editor/useQuizEditor.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    QuizDetail,
    Question,
    ReadingSubQuestion,
    MultipleChoiceQuestion,
    FillBlankQuestion,
    ReadingQuestion,
} from "@/lib/types/quiz";
import { useQuizStore } from "@/stores/quizStore";
import { QuestionType } from "./QuizEditor.constants";

interface UseQuizEditorOptions {
    quizId: string;
}

interface UseQuizEditorReturn {
    quiz: QuizDetail | null;
    isLoading: boolean;
    isSaving: boolean;
    addQuestion: (type: QuestionType) => void;
    updateQuestion: (questionId: string, updates: Partial<Question>) => void;
    deleteQuestion: (questionId: string) => void;
    addSubQuestion: (
        readingId: string,
        type: "multiple_choice" | "fill_blank"
    ) => void;
    updateSubQuestion: (
        readingId: string,
        subQId: string,
        updates: Partial<ReadingSubQuestion>
    ) => void;
    deleteSubQuestion: (readingId: string, subQId: string) => void;
    saveQuiz: () => Promise<void>;
}

const generateId = () => crypto.randomUUID();

/* ---------------- NORMALIZE DATA ---------------- */

const normalizeQuiz = (quiz: QuizDetail): QuizDetail => {
    return {
        ...quiz,
        questions: quiz.questions.map((q) => {
            if (q.type === "multiple_choice") {
                return {
                    ...q,
                    options: q.options.map((opt) => ({
                        ...opt,
                        id: opt.id ?? generateId(),
                    })),
                };
            }

            if (q.type === "reading") {
                return {
                    ...q,
                    subQuestions: q.subQuestions.map((sq) => {
                        if (sq.type === "multiple_choice") {
                            return {
                                ...sq,
                                options: sq.options.map((opt) => ({
                                    ...opt,
                                    id: opt.id ?? generateId(),
                                })),
                            };
                        }
                        return sq;
                    }),
                };
            }

            return q;
        }),
    };
};

/* ---------------- HOOK ---------------- */

export function useQuizEditor({
    quizId,
}: UseQuizEditorOptions): UseQuizEditorReturn {
    const router = useRouter();
    const getQuizDetail = useQuizStore((state) => state.getQuizDetail);
    const updateQuizDetail = useQuizStore((state) => state.updateQuizDetail);
    const setQuizDetail = useQuizStore((state) => state.setQuizDetail);
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Load quiz on mount
    useEffect(() => {
        const loadQuiz = async () => {
            setIsLoading(true); // Đảm bảo hiện loading mỗi lần vào

            // 1. Lấy nhanh từ store để hiện lên màn hình trước (UX tốt)
            const cachedQuiz = getQuizDetail(quizId);
            if (cachedQuiz) {
                setQuiz(normalizeQuiz(cachedQuiz));
                // Nếu muốn mượt, có thể set setIsLoading(false) ở đây luôn 
                // nhưng vẫn để fetch chạy ngầm phía dưới.
            }

            // 2. Luôn gọi API để lấy dữ liệu mới nhất (Chống cache)
            try {
                const response = await fetch(`/api/quizzes/${quizId}`, {
                    cache: 'no-store' // Ép trình duyệt không lấy cache
                });

                if (response.ok) {
                    const freshQuiz = await response.json();
                    setQuizDetail(quizId, freshQuiz); // Cập nhật store toàn cục
                    setQuiz(normalizeQuiz(freshQuiz)); // Cập nhật state local
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (quizId) loadQuiz();
    }, [quizId]); // Chỉ cần chạy lại khi ID thay đổi


    const addQuestion = useCallback(
        (type: QuestionType) => {
            setQuiz((prev): QuizDetail | null => {
                if (!prev) return null;

                let newQuestion: Question;

                if (type === "multiple_choice") {
                    newQuestion = {
                        id: generateId(),
                        type: "multiple_choice",
                        question: "",
                        options: [
                            { id: generateId(), text: "" },
                            { id: generateId(), text: "" },
                            { id: generateId(), text: "" },
                            { id: generateId(), text: "" },
                        ],
                        correctOptionId: "",
                    } as MultipleChoiceQuestion;
                } else if (type === "fill_blank") {
                    newQuestion = {
                        id: generateId(),
                        type: "fill_blank",
                        question: "",
                        correctAnswer: "",
                    } as FillBlankQuestion;
                } else {
                    newQuestion = {
                        id: generateId(),
                        type: "reading",
                        context: "",
                        subQuestions: [],
                    } as ReadingQuestion;
                }

                return {
                    ...prev,
                    questions: [...prev.questions, newQuestion],
                };
            });
        },
        []
    );

    const updateQuestion = useCallback(
        (questionId: string, updates: Partial<Question>) => {
            setQuiz((prev): QuizDetail | null => {
                if (!prev) return null;

                return {
                    ...prev,
                    questions: prev.questions.map((q) =>
                        q.id === questionId ? { ...q, ...updates } : q
                    ) as Question[],
                };
            });
        },
        []
    );

    const deleteQuestion = useCallback((questionId: string) => {
        setQuiz((prev): QuizDetail | null => {
            if (!prev) return null;

            return {
                ...prev,
                questions: prev.questions.filter((q) => q.id !== questionId),
            };
        });
    }, []);

    const addSubQuestion = useCallback(
        (
            readingId: string,
            type: "multiple_choice" | "fill_blank"
        ) => {
            setQuiz((prev): QuizDetail | null => {
                if (!prev) return null;

                const updatedQuestions = prev.questions.map((q) => {
                    if (q.id !== readingId || q.type !== "reading") return q;

                    let newSubQ: ReadingSubQuestion;

                    if (type === "multiple_choice") {
                        newSubQ = {
                            id: generateId(),
                            type: "multiple_choice",
                            question: "",
                            options: [
                                { id: generateId(), text: "" },
                                { id: generateId(), text: "" },
                                { id: generateId(), text: "" },
                                { id: generateId(), text: "" },
                            ],
                            correctOptionId: "",
                        };
                    } else {
                        newSubQ = {
                            id: generateId(),
                            type: "fill_blank",
                            question: "",
                            correctAnswer: "",
                        };
                    }

                    return {
                        ...q,
                        subQuestions: [...q.subQuestions, newSubQ],
                    } as ReadingQuestion;
                });

                return { ...prev, questions: updatedQuestions };
            });
        },
        []
    );

    const updateSubQuestion = useCallback(
        (
            readingId: string,
            subQId: string,
            updates: Partial<ReadingSubQuestion>
        ) => {
            setQuiz((prev): QuizDetail | null => {
                if (!prev) return null;

                return {
                    ...prev,
                    questions: prev.questions.map((q) => {
                        if (q.id !== readingId || q.type !== "reading") return q;

                        return {
                            ...q,
                            subQuestions: q.subQuestions.map((sq) =>
                                sq.id === subQId ? { ...sq, ...updates } : sq
                            ),
                        } as ReadingQuestion;
                    }),
                };
            });
        },
        []
    );

    const deleteSubQuestion = useCallback(
        (readingId: string, subQId: string) => {
            setQuiz((prev): QuizDetail | null => {
                if (!prev) return null;

                return {
                    ...prev,
                    questions: prev.questions.map((q) => {
                        if (q.id !== readingId || q.type !== "reading") return q;

                        return {
                            ...q,
                            subQuestions: q.subQuestions.filter(
                                (sq) => sq.id !== subQId
                            ),
                        } as ReadingQuestion;
                    }),
                };
            });
        },
        []
    );

    const saveQuiz = useCallback(async () => {
        if (!quiz) return;

        setIsSaving(true);
        try {
            // Call API to persist to file
            const response = await fetch(`/api/quizzes/${quizId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quiz),
            });

            if (!response.ok) {
                throw new Error('Failed to save quiz');
            }

            // Update quiz in store after successful save
            updateQuizDetail(quizId, {
                questions: quiz.questions,
                updatedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error saving quiz:", error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    }, [quiz, quizId, updateQuizDetail]);


    return {
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
    };
}
