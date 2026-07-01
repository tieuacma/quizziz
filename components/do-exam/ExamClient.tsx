"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useExamStore } from "@/stores/exam-store";
import {
    submitExamAction,
    type SubmitExamResult,
} from "@/app/actions/submit-exam-action";
import type { ExamQuizData } from "@/lib/getExamData";
import {
    animateQuestionTransition,
    animateSidebarIn,
    animateTimerWarning,
} from "@/lib/gsap-presets";
import styles from "@/styles/exam.module.css";
import ExamPreStart from "./ExamPreStart";
import ExamHeader from "./ExamHeader";
import ExamSidebar from "./ExamSidebar";
import ExamQuestionBody from "./ExamQuestionBody";
import ExamConfirmDialog from "./ExamConfirmDialog";
import ExamResultScreen from "./ExamResultScreen";
import { countAnswered, isQuestionAnswered } from "./exam-utils";

gsap.registerPlugin(useGSAP);

type Props = {
    quizId: string;
    metadata: ExamQuizData["metadata"];
    questions: ExamQuizData["questions"];
};

type ExamPhase = "prestart" | "exam" | "result";

export default function ExamClient({ quizId, metadata, questions }: Props) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const questionRef = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<HTMLDivElement | null>(null);

    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<SubmitExamResult | null>(null);
    const [now, setNow] = useState(0);
    const [autoSubmitted, setAutoSubmitted] = useState(false);

    const submitRef = useRef<(auto?: boolean) => Promise<void>>(async () => {});
    const autoSubmittedRef = useRef(autoSubmitted);
    const submittingRef = useRef(submitting);
    const hasResultRef = useRef(result);

    const {
        quizId: storedQuizId,
        currentQuestion,
        startTime,
        answers,
        flagged,
        setExam,
        setCurrentQuestion,
        setAnswer,
        toggleFlag,
        reset,
    } = useExamStore();

    // Derive phase from store state to avoid setState in effects
    const phase: ExamPhase = result
        ? "result"
        : storedQuizId === quizId && startTime
          ? "exam"
          : "prestart";

    const examTimeLimit = metadata.examTimeLimit ?? 1800;
    const current = questions[currentQuestion];
    const answeredCount = useMemo(
        () => countAnswered(questions, answers),
        [questions, answers]
    );
    const flaggedCount = useMemo(
        () => Object.values(flagged).filter(Boolean).length,
        [flagged]
    );
    const unansweredCount = questions.length - answeredCount;

    const handleStart = useCallback(() => {
        setExam(quizId, Date.now());
    }, [quizId, setExam]);

    const remainingSeconds = useMemo(() => {
        if (phase !== "exam" || !startTime || now === 0) return examTimeLimit;
        const elapsed = Math.floor((now - startTime) / 1000);
        return Math.max(0, examTimeLimit - elapsed);
    }, [now, startTime, examTimeLimit, phase]);

    const submit = useCallback(
        async (auto = false) => {
            if (submitting || result) return;
            if (auto && autoSubmitted) return;
            setSubmitting(true);
            try {
                const payload = Object.values(answers);
                const response = await submitExamAction({
                    quizId,
                    answers: payload,
                    startedAt: startTime ?? Date.now(),
                    finishedAt: Date.now(),
                });
                setResult(response);
                if (response.success) {
                    reset();
                }
                if (auto) setAutoSubmitted(true);
                if (!auto) setConfirmSubmit(false);
            } finally {
                setSubmitting(false);
            }
        },
        [answers, autoSubmitted, quizId, reset, result, startTime, submitting]
    );

    useEffect(() => {
        submitRef.current = submit;
        autoSubmittedRef.current = autoSubmitted;
        submittingRef.current = submitting;
        hasResultRef.current = result;
    }, [submit, autoSubmitted, submitting, result]);

    useEffect(() => {
        if (phase !== "exam" || result) return;

        const tick = () => {
            const currentNow = Date.now();
            setNow(currentNow);
            if (!startTime) return;

            const elapsed = Math.floor((currentNow - startTime) / 1000);
            const remaining = Math.max(0, examTimeLimit - elapsed);
            if (
                remaining === 0 &&
                !autoSubmittedRef.current &&
                !submittingRef.current &&
                !hasResultRef.current
            ) {
                void submitRef.current(true);
            }
        };

        const immediate = window.setTimeout(tick, 0);
        const timer = window.setInterval(tick, 1000);
        return () => {
            window.clearTimeout(immediate);
            window.clearInterval(timer);
        };
    }, [phase, result, startTime, examTimeLimit]);

    useEffect(() => {
        if (phase !== "exam" || result) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }
            if (e.key === "ArrowLeft" && currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
            }
            if (
                e.key === "ArrowRight" &&
                currentQuestion < questions.length - 1
            ) {
                setCurrentQuestion(currentQuestion + 1);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [phase, currentQuestion, questions.length, result, setCurrentQuestion]);

    useGSAP(
        () => {
            if (sidebarRef.current && phase === "exam")
                animateSidebarIn(sidebarRef.current);
        },
        { scope: rootRef, dependencies: [phase] }
    );

    useGSAP(
        () => {
            if (questionRef.current)
                animateQuestionTransition(questionRef.current);
        },
        { scope: questionRef, dependencies: [currentQuestion] }
    );

    useGSAP(
        () => {
            if (
                timerRef.current &&
                remainingSeconds <= 300 &&
                phase === "exam"
            ) {
                animateTimerWarning(timerRef.current);
            }
        },
        { scope: timerRef, dependencies: [remainingSeconds, phase] }
    );

    const handleRetry = useCallback(() => {
        setResult(null);
        setAutoSubmitted(false);
        setConfirmSubmit(false);
    }, []);

    if (!current && phase === "exam") {
        return (
            <div
                className={`zenith-immersive ${styles.examRoot} flex items-center justify-center text-slate-300 min-h-dvh`}
            >
                <div className="absolute inset-0 zenith-grid opacity-35 pointer-events-none" />
                <p className="relative z-10">Đề thi chưa có câu hỏi.</p>
            </div>
        );
    }

    if (phase === "prestart" && !result) {
        return (
            <ExamPreStart
                metadata={metadata}
                questionCount={questions.length}
                examTimeLimit={examTimeLimit}
                onStart={handleStart}
            />
        );
    }

    if (result?.success) {
        return (
            <ExamResultScreen
                result={result}
                autoSubmitted={autoSubmitted}
                onRetry={handleRetry}
            />
        );
    }

    return (
        <div
            ref={rootRef}
            className={`zenith-immersive ${styles.examRoot} flex flex-col h-dvh overflow-hidden text-white`}
        >
            <div className="pointer-events-none absolute inset-0 zenith-grid opacity-35 z-0" />
            <div className="pointer-events-none absolute inset-0 z-0 opacity-50 blur-3xl">
                <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-violet-500/20 animate-[float1_12s_ease-in-out_infinite]" />
                <div className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-fuchsia-500/15 animate-[float2_14s_ease-in-out_infinite]" />
            </div>

            <div ref={timerRef} className="relative z-20">
                <ExamHeader
                    title={metadata.title}
                    currentIndex={currentQuestion}
                    totalQuestions={questions.length}
                    answeredCount={answeredCount}
                    remainingSeconds={remainingSeconds}
                    examTimeLimit={examTimeLimit}
                />
            </div>

            <div className="relative z-10 flex-1 min-h-0 overflow-auto px-4 py-4 md:px-6 md:py-5">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-[300px_minmax(0,1fr)] gap-4 h-full">
                    <div ref={sidebarRef} className="hidden lg:block">
                        <ExamSidebar
                            questions={questions}
                            currentQuestion={currentQuestion}
                            answers={answers}
                            flagged={flagged}
                            answeredCount={answeredCount}
                            onSelectQuestion={setCurrentQuestion}
                            onSubmit={() => setConfirmSubmit(true)}
                        />
                    </div>

                    {current ? (
                        <div ref={questionRef} className="min-h-0">
                            <ExamQuestionBody
                                question={current}
                                questionIndex={currentQuestion}
                                totalQuestions={questions.length}
                                answer={answers[current.id]}
                                isFlagged={Boolean(flagged[current.id])}
                                onSetAnswer={setAnswer}
                                onToggleFlag={() => toggleFlag(current.id)}
                                onPrev={() =>
                                    setCurrentQuestion(currentQuestion - 1)
                                }
                                onNext={() =>
                                    setCurrentQuestion(currentQuestion + 1)
                                }
                                canPrev={currentQuestion > 0}
                                canNext={currentQuestion < questions.length - 1}
                            />
                        </div>
                    ) : null}
                </div>
            </div>

            <footer className="relative z-20 lg:hidden zenith-glass border-t border-white/10 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-400">
                        <span className="text-emerald-300 font-semibold">
                            {answeredCount}
                        </span>
                        /{questions.length} · Câu {currentQuestion + 1}
                    </div>
                    <button
                        type="button"
                        onClick={() => setConfirmSubmit(true)}
                        className="text-xs font-bold text-violet-300 px-3 py-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10"
                    >
                        Nộp bài
                    </button>
                </div>
                <div className="mt-2 flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
                    {questions.map((q, index) => {
                        const hasAnswer = isQuestionAnswered(q, answers[q.id]);
                        const isCurrent = index === currentQuestion;
                        return (
                            <button
                                key={q.id}
                                type="button"
                                onClick={() => setCurrentQuestion(index)}
                                className={`shrink-0 w-8 h-8 rounded-lg text-xs font-bold border ${
                                    isCurrent
                                        ? styles.optionNavCurrent
                                        : hasAnswer
                                          ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                                          : "border-white/10 bg-white/[0.04] text-slate-500"
                                }`}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
            </footer>

            {confirmSubmit ? (
                <ExamConfirmDialog
                    answeredCount={answeredCount}
                    totalQuestions={questions.length}
                    unansweredCount={unansweredCount}
                    flaggedCount={flaggedCount}
                    submitting={submitting}
                    onCancel={() => setConfirmSubmit(false)}
                    onConfirm={() => void submit()}
                />
            ) : null}

            {result && !result.success ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div
                        className={`${styles.glassCard} max-w-md p-6 text-center`}
                    >
                        <p className="text-rose-300 font-semibold mb-2">
                            Không nộp được bài
                        </p>
                        <p className="text-sm text-slate-400 mb-4">
                            {result.error ?? "Đã có lỗi xảy ra."}
                        </p>
                        <button
                            type="button"
                            className="text-sm text-violet-300 underline"
                            onClick={() => setResult(null)}
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
