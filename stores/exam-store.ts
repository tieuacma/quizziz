import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ExamAnswer = {
    questionId: string;
    answer: string | boolean | string[] | null;
    subAnswers?: Record<string, string | boolean | string[] | null>;
    flagged?: boolean;
};

type ExamStore = {
    quizId: string | null;
    currentQuestion: number;
    startTime: number | null;
    answers: Record<string, ExamAnswer>;
    flagged: Record<string, boolean>;
    setExam: (quizId: string, defaultStartTime: number) => void;
    setCurrentQuestion: (index: number) => void;
    setAnswer: (answer: ExamAnswer) => void;
    toggleFlag: (questionId: string) => void;
    reset: () => void;
};

const initialState = {
    quizId: null,
    currentQuestion: 0,
    startTime: null,
    answers: {},
    flagged: {},
} as const;

export const useExamStore = create<ExamStore>()(
    persist(
        (set, get) => ({
            ...initialState,
            setExam: (quizId, defaultStartTime) => {
                const state = get();
                if (state.quizId !== quizId) {
                    set({
                        quizId,
                        currentQuestion: 0,
                        startTime: defaultStartTime,
                        answers: {},
                        flagged: {},
                    });
                    return;
                }
                if (!state.startTime) {
                    set({ startTime: defaultStartTime });
                }
            },
            setCurrentQuestion: (index) => set({ currentQuestion: index }),
            setAnswer: (answer) =>
                set((state) => ({
                    answers: {
                        ...state.answers,
                        [answer.questionId]: answer,
                    },
                })),
            toggleFlag: (questionId) =>
                set((state) => ({
                    flagged: {
                        ...state.flagged,
                        [questionId]: !state.flagged[questionId],
                    },
                })),
            reset: () => set(initialState),
        }),
        {
            name: "exam-room-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                quizId: state.quizId,
                currentQuestion: state.currentQuestion,
                startTime: state.startTime,
                answers: state.answers,
                flagged: state.flagged,
            }),
        }
    )
);
