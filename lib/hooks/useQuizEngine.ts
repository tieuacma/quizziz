"use client";

import { useReducer, useEffect, useCallback, useRef } from "react";
import {
    QuizDetail,
    Question,
    ReadingSubQuestion,
    MultipleChoiceQuestion,
    FillBlankQuestion,
    ReadingQuestion,
} from "@/lib/types/quiz";

// Quiz state types
export interface QuizState {
    // Quiz status
    status: "loading" | "ready" | "playing" | "paused" | "finished";

    // Questions
    questions: Question[];
    currentQuestionIndex: number;
    flattenedQuestions: FlattenedQuestion[]; // All questions flattened (including reading sub-questions)
    currentFlattenedIndex: number;

    // Timer
    timeRemaining: number; // in seconds
    totalTimePerQuestion: number;

    // Scoring
    score: number;
    streak: number;
    maxStreak: number;
    correctAnswers: number;
    totalAnswered: number;

    // Answer tracking
    answers: Record<string, AnsweredQuestion>;

    // Reading passage tracking
    currentReadingPassage: string | null;
}

export interface FlattenedQuestion {
    id: string;
    originalIndex: number;
    type: "multiple_choice" | "fill_blank";
    isSubQuestion: boolean;
    parentId?: string;
    question: string;

    // For multiple choice
    options?: { id: string; text: string }[];
    correctOptionId?: string;

    // For fill blank
    correctAnswer?: string;
}

export interface AnsweredQuestion {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    timeSpent: number;
    streakAtAnswer: number;
}

// Action types
type QuizAction =
    | { type: "LOAD_QUIZ"; payload: QuizDetail }
    | { type: "START_QUIZ" }
    | { type: "TICK" }
    | { type: "ANSWER_QUESTION"; payload: { questionId: string; answer: string } }
    | { type: "NEXT_QUESTION" }
    | { type: "PREVIOUS_QUESTION" }
    | { type: "TIME_UP" }
    | { type: "FINISH_QUIZ" }
    | { type: "RESTART_QUIZ" };

// Constants
const BASE_POINTS = 1000;
const DEFAULT_TIME_PER_QUESTION = 30; // seconds

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Flatten questions including reading sub-questions
const generateId = () => crypto.randomUUID();

function flattenQuestions(
    questions: Question[],
    shuffle: boolean = true
): FlattenedQuestion[] {
    let flattened: FlattenedQuestion[] = [];

    questions.forEach((q, originalIndex) => {
        const normalizeOptions = (opts?: any[]) =>
            opts?.map(opt => ({
                ...opt,
                id: opt.id || generateId()
            })) || [];

        if (q.type === "reading") {
            const readingQ = q as ReadingQuestion;
            readingQ.subQuestions.forEach((sq) => {
                flattened.push({
                    id: sq.id || generateId(),
                    originalIndex,
                    type: sq.type,
                    isSubQuestion: true,
                    parentId: q.id,
                    question: sq.question,
                    options: sq.type === "multiple_choice" ? normalizeOptions((sq as any).options) : undefined,
                    // ĐẢM BẢO lấy đúng trường từ dữ liệu gốc
                    correctOptionId: (sq as any).correctOptionId || (sq as any).correctAnswer,
                    correctAnswer: (sq as any).correctAnswer,
                });
            });
        } else {
            flattened.push({
                id: q.id || generateId(),
                originalIndex,
                type: q.type as "multiple_choice" | "fill_blank",
                isSubQuestion: false,
                question: (q as any).question,
                options: q.type === "multiple_choice" ? normalizeOptions((q as any).options) : undefined,
                // SỬA DÒNG NÀY: Ưu tiên lấy correctOptionId, nếu không có thì lấy từ correctAnswer
                correctOptionId: (q as any).correctOptionId || (q as any).correctAnswer,
                correctAnswer: (q as any).correctAnswer,
            });
        }
    });

    return shuffle ? shuffleArray(flattened) : flattened;
}
// Calculate points based on time
function calculatePoints(timeRemaining: number, totalTime: number, streak: number): number {
    // Base points from time
    const timeRatio = Math.max(0, timeRemaining / totalTime);
    const basePoints = Math.round(BASE_POINTS * timeRatio);

    // Streak bonus: max(500, (streak // 3) * 100)
    const streakBonus = Math.min(900, Math.floor(streak / 3) * 300);

    return basePoints + (streak >= 3 ? streakBonus : 0);
}

// Initial state
function getInitialState(): QuizState {
    return {
        status: "loading",
        questions: [],
        currentQuestionIndex: 0,
        flattenedQuestions: [],
        currentFlattenedIndex: 0,
        timeRemaining: DEFAULT_TIME_PER_QUESTION,
        totalTimePerQuestion: DEFAULT_TIME_PER_QUESTION,
        score: 0,
        streak: 0,
        maxStreak: 0,
        correctAnswers: 0,
        totalAnswered: 0,
        answers: {},
        currentReadingPassage: null,
    };
}

// Reducer
function quizReducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
        case "LOAD_QUIZ": {
            const { questions } = action.payload;
            // Log này sẽ cho bạn biết chính xác trình duyệt đang nhận được bao nhiêu câu
            console.log("🔥 QUIZ DATA INPUT:", questions);
            const flattened = flattenQuestions(questions, true);

            // Get first question to check if it's a reading passage
            const firstQ = flattened[0];
            let readingPassage: string | null = null;

            if (firstQ?.isSubQuestion) {
                const parentQ = questions.find(q => q.id === firstQ.parentId) as ReadingQuestion;
                readingPassage = parentQ?.context || null;
            }

            return {
                ...getInitialState(),
                status: "ready",
                questions,
                flattenedQuestions: flattened,
                currentQuestionIndex: firstQ?.originalIndex || 0,
                currentFlattenedIndex: 0,
                currentReadingPassage: readingPassage,
            };
        }

        case "START_QUIZ": {
            return {
                ...state,
                status: "playing",
                timeRemaining: state.totalTimePerQuestion,
            };
        }

        case "TICK": {
            if (state.status !== "playing") return state;
            if (state.timeRemaining <= 0) return state;

            return {
                ...state,
                timeRemaining: state.timeRemaining - 1,
            };
        }

        case "ANSWER_QUESTION": {
            const { questionId, answer } = action.payload;
            const currentQ = state.flattenedQuestions[state.currentFlattenedIndex];

            if (!currentQ || state.answers[questionId]) return state;

            let isCorrect = false;

            if (currentQ.type === "multiple_choice") {
                // Log để kiểm tra thực tế
                isCorrect = String(answer) === String(currentQ.correctOptionId);
            } else {
                const normalize = (a: any) => String(a || "").trim().toLowerCase();
                isCorrect = normalize(answer) === normalize(currentQ.correctAnswer);
            }

            // Update streak
            const newStreak = isCorrect ? state.streak + 1 : 0;
            const maxStreak = Math.max(state.maxStreak, newStreak);

            // Calculate points
            const pointsEarned = isCorrect
                ? calculatePoints(state.timeRemaining, state.totalTimePerQuestion, state.streak)
                : 0;

            const timeSpent = state.totalTimePerQuestion - state.timeRemaining;

            const answeredQuestion: AnsweredQuestion = {
                questionId,
                userAnswer: answer,
                isCorrect,
                pointsEarned,
                timeSpent,
                streakAtAnswer: state.streak,
            };

            return {
                ...state,
                score: state.score + pointsEarned,
                streak: newStreak,
                maxStreak,
                correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
                totalAnswered: state.totalAnswered + 1,
                answers: {
                    ...state.answers,
                    [questionId]: answeredQuestion,
                },
            };
        }

        case "NEXT_QUESTION": {
            const nextIndex = state.currentFlattenedIndex + 1;

            // Check if quiz is finished
            if (nextIndex >= state.flattenedQuestions.length) {
                return {
                    ...state,
                    status: "finished",
                };
            }

            const nextQ = state.flattenedQuestions[nextIndex];

            // Check if we moved to a new reading passage
            let newReadingPassage: string | null = null;

            // Always set reading passage based on the next question
            // If next question is a sub-question, show its parent's passage
            // If next question is NOT a sub-question, hide the passage
            if (nextQ.isSubQuestion) {
                const parentQ = state.questions.find(q => q.id === nextQ.parentId) as ReadingQuestion;
                newReadingPassage = parentQ?.context || null;
            }

            return {
                ...state,
                currentFlattenedIndex: nextIndex,
                currentQuestionIndex: nextQ.originalIndex,
                timeRemaining: state.totalTimePerQuestion,
                currentReadingPassage: newReadingPassage,
            };
        }

        case "PREVIOUS_QUESTION": {
            const prevIndex = Math.max(0, state.currentFlattenedIndex - 1);
            const prevQ = state.flattenedQuestions[prevIndex];

            // Always set reading passage based on the previous question
            // If previous question is a sub-question, show its parent's passage
            // If previous question is NOT a sub-question, hide the passage
            let newReadingPassage: string | null = null;
            if (prevQ.isSubQuestion) {
                const parentQ = state.questions.find(q => q.id === prevQ.parentId) as ReadingQuestion;
                newReadingPassage = parentQ?.context || null;
            }

            return {
                ...state,
                currentFlattenedIndex: prevIndex,
                currentQuestionIndex: prevQ.originalIndex,
                timeRemaining: state.totalTimePerQuestion,
                currentReadingPassage: newReadingPassage,
            };
        }

        case "TIME_UP": {
            const currentQ = state.flattenedQuestions[state.currentFlattenedIndex];

            // Mark as unanswered if not answered
            if (!state.answers[currentQ?.id]) {
                return {
                    ...state,
                    streak: 0,
                    totalAnswered: state.totalAnswered + 1,
                    answers: {
                        ...state.answers,
                        [currentQ.id]: {
                            questionId: currentQ.id,
                            userAnswer: "",
                            isCorrect: false,
                            pointsEarned: 0,
                            timeSpent: state.totalTimePerQuestion,
                            streakAtAnswer: state.streak,
                        },
                    },
                };
            }

            return state;
        }

        case "FINISH_QUIZ": {
            return {
                ...state,
                status: "finished",
            };
        }

        case "RESTART_QUIZ": {
            const flattened = flattenQuestions(state.questions, true);

            const firstQ = flattened[0];
            let readingPassage: string | null = null;

            if (firstQ?.isSubQuestion) {
                const parentQ = state.questions.find(
                    q => q.id === firstQ.parentId
                ) as ReadingQuestion;
                readingPassage = parentQ?.context || null;
            }

            return {
                ...getInitialState(),
                status: "ready",
                questions: state.questions,
                flattenedQuestions: flattened,
                currentQuestionIndex: firstQ?.originalIndex || 0,
                currentFlattenedIndex: 0,
                currentReadingPassage: readingPassage,
            };
        }

        default:
            return state;
    }
}

// Hook
export function useQuizEngine(quiz: QuizDetail | null) {
    const [state, dispatch] = useReducer(quizReducer, getInitialState());
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Load quiz
    useEffect(() => {
        if (quiz) {
            dispatch({ type: "LOAD_QUIZ", payload: quiz });
        }
    }, [quiz]);

    // Timer
    useEffect(() => {
        if (state.status === "playing") {
            timerRef.current = setInterval(() => {
                dispatch({ type: "TICK" });
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [state.status]);

    // Auto time up
    useEffect(() => {
        if (state.timeRemaining <= 0 && state.status === "playing") {
            dispatch({ type: "TIME_UP" });
            dispatch({ type: "NEXT_QUESTION" });
        }
    }, [state.timeRemaining, state.status]);

    // Actions
    const startQuiz = useCallback(() => {
        dispatch({ type: "START_QUIZ" });
    }, []);

    const answerQuestion = useCallback((questionId: string, answer: string) => {
        dispatch({ type: "ANSWER_QUESTION", payload: { questionId, answer } });
    }, []);

    const nextQuestion = useCallback(() => {
        dispatch({ type: "NEXT_QUESTION" });
    }, []);

    const previousQuestion = useCallback(() => {
        dispatch({ type: "PREVIOUS_QUESTION" });
    }, []);

    const finishQuiz = useCallback(() => {
        dispatch({ type: "FINISH_QUIZ" });
    }, []);

    const restartQuiz = useCallback(() => {
        dispatch({ type: "RESTART_QUIZ" });
    }, []);

    // Computed values
    const currentQuestion = state.flattenedQuestions[state.currentFlattenedIndex] || null;
    const progress = state.flattenedQuestions.length > 0
        ? ((state.currentFlattenedIndex + 1) / state.flattenedQuestions.length) * 100
        : 0;
    const accuracy = state.totalAnswered > 0
        ? Math.round((state.correctAnswers / state.totalAnswered) * 100)
        : 0;
    const isOnFire = state.streak >= 3;

    return {
        state,
        currentQuestion,
        progress,
        accuracy,
        isOnFire,
        startQuiz,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        finishQuiz,
        restartQuiz,
    };
}
