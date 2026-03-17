// app/stores/quizStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware"; // Tùy chọn: giúp lưu dữ liệu vào localStorage
import {
    QuizOverview,
    QuizDetail,
    Question
} from "@/lib/types/quiz";

interface QuizState {
    quizOverviews: QuizOverview[];
    quizDetails: Record<string, QuizDetail>;

    // Actions
    setQuizOverviews: (overviews: QuizOverview[]) => void;
    setQuizDetail: (id: string, detail: QuizDetail) => void;

    // Getters
    getQuizOverview: (id: string) => QuizOverview | undefined;
    getQuizDetail: (id: string) => QuizDetail | undefined;

    // Quiz Management
    createQuiz: (data: Omit<QuizOverview, "id" | "createdAt">) => string;
    updateQuizOverview: (id: string, data: Partial<QuizOverview>) => void;
    updateQuizDetail: (id: string, data: Partial<QuizDetail>) => void;

    // Question Management
    addQuestion: (quizId: string, question: Question) => void;
    updateQuestion: (quizId: string, questionId: string, data: Partial<Question>) => void;
    deleteQuestion: (quizId: string, questionId: string) => void;
    reorderQuestions: (quizId: string, fromIndex: number, toIndex: number) => void;
}

export const useQuizStore = create<QuizState>()(
    // Persist giúp dữ liệu không bị mất khi F5 (Reload) trang
    persist(
        (set, get) => ({
            quizOverviews: [],
            quizDetails: {},

            // Setters
            setQuizOverviews: (overviews) => set({ quizOverviews: overviews }),
            setQuizDetail: (id, detail) =>
                set((state) => ({
                    quizDetails: { ...state.quizDetails, [id]: detail }
                })),

            // Getters (Sử dụng get() để truy cập state hiện tại)
            getQuizOverview: (id) => get().quizOverviews.find((q) => q.id === id),
            getQuizDetail: (id) => get().quizDetails[id],

            // Create new quiz
            createQuiz: (data) => {
                const id = `quiz-${Date.now()}`;
                const newQuiz: QuizOverview = {
                    ...data,
                    id,
                    createdAt: new Date().toISOString(),
                };

                const newDetail: QuizDetail = {
                    ...newQuiz,
                    questions: [],
                    updatedAt: new Date().toISOString(),
                };

                set((state) => ({
                    quizOverviews: [...state.quizOverviews, newQuiz],
                    quizDetails: { ...state.quizDetails, [id]: newDetail },
                }));

                return id;
            },

            // Update overview
            updateQuizOverview: (id, data) =>
                set((state) => ({
                    quizOverviews: state.quizOverviews.map((q) =>
                        q.id === id ? { ...q, ...data } : q
                    ),
                })),

            // Update detail
            updateQuizDetail: (id, data) =>
                set((state) => ({
                    quizDetails: {
                        ...state.quizDetails,
                        [id]: {
                            ...state.quizDetails[id],
                            ...data,
                            updatedAt: new Date().toISOString(),
                        },
                    },
                })),

            // Question Management
            addQuestion: (quizId, question) =>
                set((state) => {
                    const currentQuiz = state.quizDetails[quizId];
                    if (!currentQuiz) return state;
                    return {
                        quizDetails: {
                            ...state.quizDetails,
                            [quizId]: {
                                ...currentQuiz,
                                questions: [...currentQuiz.questions, question],
                                updatedAt: new Date().toISOString(),
                            },
                        },
                    };
                }),

            updateQuestion: (quizId, questionId, data) =>
                set((state) => {
                    const currentQuiz = state.quizDetails[quizId];
                    if (!currentQuiz) return state;
                    return {
                        quizDetails: {
                            ...state.quizDetails,
                            [quizId]: {
                                ...currentQuiz,
                                questions: currentQuiz.questions.map((q) =>
                                    q.id === questionId ? { ...q, ...data } : q
                                ) as Question[],
                                updatedAt: new Date().toISOString(),
                            },
                        },
                    };
                }),

            deleteQuestion: (quizId, questionId) =>
                set((state) => {
                    const currentQuiz = state.quizDetails[quizId];
                    if (!currentQuiz) return state;
                    return {
                        quizDetails: {
                            ...state.quizDetails,
                            [quizId]: {
                                ...currentQuiz,
                                questions: currentQuiz.questions.filter((q) => q.id !== questionId),
                                updatedAt: new Date().toISOString(),
                            },
                        },
                    };
                }),

            reorderQuestions: (quizId, fromIndex, toIndex) =>
                set((state) => {
                    const currentQuiz = state.quizDetails[quizId];
                    if (!currentQuiz) return state;

                    const newQuestions = [...currentQuiz.questions];
                    const [removed] = newQuestions.splice(fromIndex, 1);
                    newQuestions.splice(toIndex, 0, removed);

                    return {
                        quizDetails: {
                            ...state.quizDetails,
                            [quizId]: {
                                ...currentQuiz,
                                questions: newQuestions,
                                updatedAt: new Date().toISOString(),
                            },
                        },
                    };
                }),
        }),
        {
            name: "quiz-storage", // Tên key trong localStorage
        }
    )
);

export const getQuizStore = () => useQuizStore.getState();