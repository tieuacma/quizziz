"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type {
    QuizQuestion,
    QuizState,
    MultipleChoiceQuestion,
    ReadingQuestion,
    PowerUpType,
    LeaderboardParticipant,
    AudioSettingsState,
} from "@/types/quiz";

import { gradeReadingSub } from "@/lib/quiz-game/grade";
import { READING_SUB_ADVANCE_MS } from "@/components/quiz-game/motion";

const DEFAULT_TIME_LIMIT = 180;
const DEFAULT_AUDIO: AudioSettingsState = { music: true, sfx: true };

type QuizStateWithExtras = QuizState & {
    currentSubQuestionIndex: number;
    maxStreak: number;
};

export function superShuffle<T extends QuizQuestion[]>(questions: T): T {
    const globalShuffled = [...questions];
    for (let i = globalShuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [globalShuffled[i], globalShuffled[j]] = [
            globalShuffled[j],
            globalShuffled[i],
        ];
    }

    return globalShuffled.map((question) => {
        if (question.type === "multiple-choice") {
            const mcq = question as MultipleChoiceQuestion;
            const options = [...mcq.options];
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }
            return { ...mcq, options } as MultipleChoiceQuestion;
        }

        if (question.type === "reading") {
            const reading = question as ReadingQuestion;
            const subQuestions = [...reading.questions];
            for (let i = subQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [subQuestions[i], subQuestions[j]] = [
                    subQuestions[j],
                    subQuestions[i],
                ];
            }
            return { ...reading, questions: subQuestions } as ReadingQuestion;
        }

        return question;
    }) as T;
}

function normalizeTimeLimit(q: QuizQuestion): QuizQuestion {
    const raw =
        q.timeLimit ??
        ("defaultTime" in q
            ? (q as QuizQuestion & { defaultTime?: number }).defaultTime
            : undefined);

    const timeLimit =
        typeof raw === "number" && raw > 0 ? raw : DEFAULT_TIME_LIMIT;
    return { ...q, timeLimit };
}

export function useQuizLogic(
    initialQuestions: QuizQuestion[],
    profileId: string,
    quizId: string
) {
    const sourceQuestions = useMemo(
        () => initialQuestions.map(normalizeTimeLimit),
        [initialQuestions]
    );

    const [gameQuestions, setGameQuestions] = useState<QuizQuestion[]>([]);
    const [isPracticeMode, setIsPracticeMode] = useState(false);

    const questions = gameQuestions;

    const [quizState, setQuizState] = useState<QuizStateWithExtras>(() => ({
        profile_id: profileId,
        quiz_id: quizId,
        correct_count: 0,
        wrong_count: 0,
        current_question_index: 0,
        score: 0,
        streak: 0,
        status: initialQuestions.length > 0 ? "ready" : "idle",
        incorrect_questions: [],
        currentSubQuestionIndex: 0,
        maxStreak: 0,
        powerups: {
            inventory: { freeze: 1, eraser: 1, shield: 1, double: 1 },
            active: {
                freeze: false,
                shield: false,
                double: false,
                eraser: false,
            },
        },
        leaderboard: [
            {
                id: profileId,
                name: "Bạn (Người chơi) 👤",
                avatar: "👤",
                score: 0,
                streak: 0,
                isPlayer: true,
            },
            {
                id: "bot-1",
                name: "Minh Anh ⚡",
                avatar: "⚡",
                score: 0,
                streak: 0,
                isPlayer: false,
            },
            {
                id: "bot-2",
                name: "Ngọc Vy 🌸",
                avatar: "🌸",
                score: 0,
                streak: 0,
                isPlayer: false,
            },
            {
                id: "bot-3",
                name: "Quốc Bảo 🦈",
                avatar: "🦈",
                score: 0,
                streak: 0,
                isPlayer: false,
            },
            {
                id: "bot-4",
                name: "Hoàng Long 🐉",
                avatar: "🐉",
                score: 0,
                streak: 0,
                isPlayer: false,
            },
        ],
        audioSettings: DEFAULT_AUDIO,
    }));

    const [timeLeft, setTimeLeft] = useState(0);
    const timeLeftRef = useRef(0);
    const [readingSubAnswers, setReadingSubAnswers] = useState<
        Record<string, string>
    >({});
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const streakRef = useRef(0);
    const isTransitioningRef = useRef(false);

    const estimatedSeconds = useMemo(
        () =>
            sourceQuestions.reduce(
                (sum, q) => sum + (q.timeLimit ?? DEFAULT_TIME_LIMIT),
                0
            ),
        [sourceQuestions]
    );

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const releaseTransition = useCallback(() => {
        isTransitioningRef.current = false;
    }, []);

    useEffect(() => {
        timeLeftRef.current = timeLeft;
    }, [timeLeft]);

    useEffect(() => {
        streakRef.current = quizState.streak;
    }, [quizState.streak]);

    const calculateScore = useCallback(
        (isCorrect: boolean, question?: QuizQuestion, ratio = 1) => {
            if (!isCorrect || !question) return 0;
            const baseScore =
                (timeLeftRef.current / question.timeLimit) * 1000 * ratio;
            const streakMultiplier = streakRef.current >= 3 ? 1.5 : 1;
            const bonusScore = Math.min((streakRef.current / 3) * 300, 1500);
            return Math.round((baseScore + bonusScore) * streakMultiplier);
        },
        []
    );

    const advanceAfterAnswer = useCallback(
        (isCorrect: boolean, points: number) => {
            if (isTransitioningRef.current) return;
            isTransitioningRef.current = true;

            setQuizState((prev) => {
                if (prev.status !== "playing") {
                    releaseTransition();
                    return prev;
                }

                const currentQuestion = questions[prev.current_question_index];
                if (!currentQuestion) {
                    releaseTransition();
                    return prev;
                }

                const isShieldActive = prev.powerups?.active.shield;
                const isDoubleActive = prev.powerups?.active.double;
                const isActuallyCorrect = isCorrect || isShieldActive;

                let newStreak = prev.streak;
                if (isCorrect) {
                    newStreak = prev.streak + 1;
                } else if (!isShieldActive) {
                    newStreak = 0;
                }
                streakRef.current = newStreak;

                const nextMaxStreak = Math.max(prev.maxStreak, newStreak);

                const incorrect = isActuallyCorrect
                    ? prev.incorrect_questions
                    : [...prev.incorrect_questions, currentQuestion.id];

                const actualPoints =
                    isDoubleActive && isActuallyCorrect ? points * 2 : points;
                const nextScore = prev.score + actualPoints;

                const nextActive = prev.powerups
                    ? {
                          ...prev.powerups.active,
                          shield: false,
                          double: false,
                          eraser: false,
                      }
                    : undefined;

                const nextPowerups = prev.powerups
                    ? {
                          ...prev.powerups,
                          active: nextActive!,
                      }
                    : undefined;

                const nextLeaderboard = (prev.leaderboard || [])
                    .map((p: LeaderboardParticipant) =>
                        p.isPlayer
                            ? { ...p, score: nextScore, streak: newStreak }
                            : p
                    )
                    .sort((a, b) => b.score - a.score);

                const nextIndex = prev.current_question_index + 1;
                const isFinished = nextIndex >= questions.length;

                const baseUpdate: QuizStateWithExtras = {
                    ...prev,
                    correct_count: isCorrect
                        ? prev.correct_count + 1
                        : prev.correct_count,
                    wrong_count: isActuallyCorrect
                        ? prev.wrong_count
                        : prev.wrong_count + 1,
                    score: nextScore,
                    streak: newStreak,
                    maxStreak: nextMaxStreak,
                    incorrect_questions: incorrect,
                    powerups: nextPowerups,
                    leaderboard: nextLeaderboard,
                    // keep other fields from prev; we'll override indexes/status below
                    currentSubQuestionIndex: prev.currentSubQuestionIndex,
                };

                if (isFinished) {
                    clearTimer();
                    queueMicrotask(() => {
                        setReadingSubAnswers({});
                        releaseTransition();
                    });
                    return { ...baseUpdate, status: "finished" as const };
                }

                const nextTime = questions[nextIndex].timeLimit;
                queueMicrotask(() => {
                    setTimeLeft(nextTime);
                    timeLeftRef.current = nextTime;
                    setReadingSubAnswers({});
                    releaseTransition();
                });

                return {
                    ...baseUpdate,
                    current_question_index: nextIndex,
                    currentSubQuestionIndex: 0,
                };
            });
        },
        [questions, clearTimer, releaseTransition]
    );

    const handleAnswer = useCallback(
        (isCorrect: boolean) => {
            if (isTransitioningRef.current) return;
            clearTimer();
            const currentQuestion = questions[quizState.current_question_index];
            const points = calculateScore(isCorrect, currentQuestion);
            advanceAfterAnswer(isCorrect, points);
        },
        [
            questions,
            quizState.current_question_index,
            calculateScore,
            advanceAfterAnswer,
            clearTimer,
        ]
    );

    const handleTimeOut = useCallback(() => {
        if (isTransitioningRef.current) return;
        handleAnswer(false);
    }, [handleAnswer]);

    const handleSubQuestionAnswer = useCallback(
        (subQuestionId: string, answer: string) => {
            setReadingSubAnswers((prev) => {
                if (prev[subQuestionId]) return prev;
                return { ...prev, [subQuestionId]: answer };
            });

            const currentQuestion = questions[quizState.current_question_index];
            if (currentQuestion?.type !== "reading") return;

            const readingQuestion = currentQuestion as ReadingQuestion;
            setTimeout(() => {
                setQuizState((prev) => {
                    if (
                        prev.currentSubQuestionIndex <
                        readingQuestion.questions.length - 1
                    ) {
                        return {
                            ...prev,
                            currentSubQuestionIndex:
                                prev.currentSubQuestionIndex + 1,
                        };
                    }
                    return prev;
                });
            }, READING_SUB_ADVANCE_MS);
        },
        [questions, quizState.current_question_index]
    );

    const isReadingQuestionComplete = useCallback(
        (question?: QuizQuestion) => {
            if (!question || question.type !== "reading") return true;
            const reading = question as ReadingQuestion;
            return reading.questions.every(
                (sub) => !!readingSubAnswers[sub.id]
            );
        },
        [readingSubAnswers]
    );

    const handleCompleteReading = useCallback(
        (question: ReadingQuestion) => {
            if (isTransitioningRef.current) return;
            if (!isReadingQuestionComplete(question)) return;

            let correctSubCount = 0;
            const totalSubs = question.questions.length;

            question.questions.forEach((sub) => {
                const userAnswer = readingSubAnswers[sub.id];
                if (userAnswer && gradeReadingSub(sub, userAnswer)) {
                    correctSubCount++;
                }
            });

            const ratio = totalSubs > 0 ? correctSubCount / totalSubs : 0;
            const isOverallCorrect = correctSubCount === totalSubs;
            const points = calculateScore(isOverallCorrect, question, ratio);

            advanceAfterAnswer(isOverallCorrect, points);
        },
        [
            isReadingQuestionComplete,
            readingSubAnswers,
            calculateScore,
            advanceAfterAnswer,
        ]
    );

    useEffect(() => {
        if (quizState.status !== "playing" || questions.length === 0) {
            clearTimer();
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (isTransitioningRef.current) return prev;
                if (quizState.powerups?.active.freeze) return prev;
                if (prev <= 1) {
                    clearTimer();
                    handleTimeOut();
                    return 0;
                }
                const next = prev - 1;
                timeLeftRef.current = next;
                return next;
            });
        }, 1000);

        return clearTimer;
    }, [
        quizState.status,
        quizState.current_question_index,
        quizState.powerups?.active.freeze,
        questions.length,
        handleTimeOut,
        clearTimer,
    ]);

    const startQuiz = useCallback(
        (questionSet?: QuizQuestion[]) => {
            const pool = questionSet ?? sourceQuestions;
            if (pool.length === 0) return;

            clearTimer();
            isTransitioningRef.current = false;

            const shuffled = superShuffle(pool.map(normalizeTimeLimit));
            setGameQuestions(shuffled);
            setIsPracticeMode(!!questionSet);

            const firstTime = shuffled[0].timeLimit;
            setTimeLeft(firstTime);
            timeLeftRef.current = firstTime;

            setQuizState({
                profile_id: profileId,
                quiz_id: quizId,
                correct_count: 0,
                wrong_count: 0,
                current_question_index: 0,
                score: 0,
                streak: 0,
                status: "playing",
                incorrect_questions: [],
                currentSubQuestionIndex: 0,
                maxStreak: 0,
                powerups: {
                    inventory: { freeze: 1, eraser: 1, shield: 1, double: 1 },
                    active: {
                        freeze: false,
                        shield: false,
                        double: false,
                        eraser: false,
                    },
                },
                leaderboard: [
                    {
                        id: profileId,
                        name: "Bạn (Người chơi) 👤",
                        avatar: "👤",
                        score: 0,
                        streak: 0,
                        isPlayer: true,
                    },
                    {
                        id: "bot-1",
                        name: "Minh Anh ⚡",
                        avatar: "⚡",
                        score: 0,
                        streak: 0,
                        isPlayer: false,
                    },
                    {
                        id: "bot-2",
                        name: "Ngọc Vy 🌸",
                        avatar: "🌸",
                        score: 0,
                        streak: 0,
                        isPlayer: false,
                    },
                    {
                        id: "bot-3",
                        name: "Quốc Bảo 🦈",
                        avatar: "🦈",
                        score: 0,
                        streak: 0,
                        isPlayer: false,
                    },
                    {
                        id: "bot-4",
                        name: "Hoàng Long 🐉",
                        avatar: "🐉",
                        score: 0,
                        streak: 0,
                        isPlayer: false,
                    },
                ],
                audioSettings: DEFAULT_AUDIO,
            });

            setReadingSubAnswers({});
        },
        [sourceQuestions, profileId, quizId, clearTimer]
    );

    const restartQuiz = useCallback(() => {
        clearTimer();
        isTransitioningRef.current = false;
        setGameQuestions([]);
        setIsPracticeMode(false);
        setReadingSubAnswers({});
        setTimeLeft(0);
        timeLeftRef.current = 0;

        setQuizState({
            profile_id: profileId,
            quiz_id: quizId,
            correct_count: 0,
            wrong_count: 0,
            current_question_index: 0,
            score: 0,
            streak: 0,
            status: "ready",
            incorrect_questions: [],
            currentSubQuestionIndex: 0,
            maxStreak: 0,
            powerups: {
                inventory: { freeze: 1, eraser: 1, shield: 1, double: 1 },
                active: {
                    freeze: false,
                    shield: false,
                    double: false,
                    eraser: false,
                },
            },
            leaderboard: [
                {
                    id: profileId,
                    name: "Bạn (Người chơi) 👤",
                    avatar: "👤",
                    score: 0,
                    streak: 0,
                    isPlayer: true,
                },
                {
                    id: "bot-1",
                    name: "Minh Anh ⚡",
                    avatar: "⚡",
                    score: 0,
                    streak: 0,
                    isPlayer: false,
                },
                {
                    id: "bot-2",
                    name: "Ngọc Vy 🌸",
                    avatar: "🌸",
                    score: 0,
                    streak: 0,
                    isPlayer: false,
                },
                {
                    id: "bot-3",
                    name: "Quốc Bảo 🦈",
                    avatar: "🦈",
                    score: 0,
                    streak: 0,
                    isPlayer: false,
                },
                {
                    id: "bot-4",
                    name: "Hoàng Long 🐉",
                    avatar: "🐉",
                    score: 0,
                    streak: 0,
                    isPlayer: false,
                },
            ],
            audioSettings: DEFAULT_AUDIO,
        });
    }, [profileId, quizId, clearTimer]);

    const activatePowerUp = useCallback((type: PowerUpType) => {
        setQuizState((prev) => {
            if (!prev.powerups) return prev;
            const inventory = prev.powerups.inventory;
            const active = prev.powerups.active;

            if (inventory[type] <= 0) return prev;

            const newInventory = {
                ...inventory,
                [type]: inventory[type] - 1,
            };

            const newActive = {
                ...active,
                [type]: true,
            };

            if (type === "freeze") {
                setTimeout(() => {
                    setQuizState((latest) => {
                        if (!latest.powerups) return latest;
                        return {
                            ...latest,
                            powerups: {
                                ...latest.powerups,
                                active: {
                                    ...latest.powerups.active,
                                    freeze: false,
                                },
                            },
                        };
                    });
                }, 10000);
            }

            return {
                ...prev,
                powerups: {
                    inventory: newInventory,
                    active: newActive,
                },
            };
        });
    }, []);

    const toggleAudioSetting = useCallback((setting: "music" | "sfx") => {
        setQuizState((prev) => {
            if (!prev.audioSettings) return prev;
            return {
                ...prev,
                audioSettings: {
                    ...prev.audioSettings,
                    [setting]: !prev.audioSettings[setting],
                },
            };
        });
    }, []);

    useEffect(() => {
        if (quizState.status !== "playing") return;

        const interval = setInterval(() => {
            setQuizState((prev) => {
                if (prev.status !== "playing") return prev;

                const updatedLeaderboard = (prev.leaderboard || [])
                    .map((p) => {
                        if (p.isPlayer) return p;
                        if (Math.random() > 0.55) {
                            const isCorrect = Math.random() > 0.25;
                            if (isCorrect) {
                                const nextStreak = p.streak + 1;
                                const pointsGained = Math.round(
                                    500 +
                                        Math.random() * 400 +
                                        Math.min(nextStreak * 50, 200)
                                );
                                return {
                                    ...p,
                                    score: p.score + pointsGained,
                                    streak: nextStreak,
                                };
                            }
                            return { ...p, streak: 0 };
                        }
                        return p;
                    })
                    .sort((a, b) => b.score - a.score);

                return {
                    ...prev,
                    leaderboard: updatedLeaderboard,
                };
            });
        }, 4500);

        return () => clearInterval(interval);
    }, [quizState.status]);

    const startPracticeWrong = useCallback(() => {
        const wrongIds = quizState.incorrect_questions;
        const wrongQuestions = sourceQuestions.filter((q) =>
            wrongIds.includes(q.id)
        );
        if (wrongQuestions.length === 0) return;
        startQuiz(wrongQuestions);
    }, [quizState.incorrect_questions, sourceQuestions, startQuiz]);

    const currentQuestion =
        quizState.status === "playing"
            ? questions[quizState.current_question_index]
            : undefined;

    return {
        questions,
        sourceQuestions,
        quizState,
        timeLeft,
        estimatedSeconds,
        readingSubAnswers,
        currentQuestion,
        handleAnswer,
        handleSubQuestionAnswer,
        handleCompleteReading,
        isReadingQuestionComplete,
        startQuiz,
        restartQuiz,
        startPracticeWrong,
        isPracticeMode,
        isQuizFinished: quizState.status === "finished",
        isReady: quizState.status === "ready",
        isIdle: quizState.status === "idle",
        activatePowerUp,
        toggleAudioSetting,
        powerups: quizState.powerups,
        leaderboard: quizState.leaderboard,
        audioSettings: quizState.audioSettings,
    };
}
