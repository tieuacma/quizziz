"use client";

import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ExamAnswer } from "@/stores/exam-store";
import type { ExamQuestion } from "./exam-utils";
import { questionTypeLabel } from "./exam-utils";
import styles from "@/styles/exam.module.css";

type Props = {
    question: ExamQuestion;
    questionIndex: number;
    totalQuestions: number;
    answer?: ExamAnswer;
    isFlagged: boolean;
    onSetAnswer: (answer: ExamAnswer) => void;
    onToggleFlag: () => void;
    onPrev: () => void;
    onNext: () => void;
    canPrev: boolean;
    canNext: boolean;
};

export default function ExamQuestionBody({
    question,
    questionIndex,
    totalQuestions,
    answer,
    isFlagged,
    onSetAnswer,
    onToggleFlag,
    onPrev,
    onNext,
    canPrev,
    canNext,
}: Props) {
    const flagged = isFlagged;

    return (
        <Card className={styles.glassCard}>
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-wider">
                        Câu {questionIndex + 1} / {totalQuestions}
                    </p>
                    <p className="text-xs font-semibold text-violet-300/90 mt-0.5">
                        {questionTypeLabel(question.type)}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleFlag}
                    className={
                        isFlagged
                            ? "border-amber-400/60 bg-amber-500/15 text-amber-200"
                            : "border-white/10 bg-white/[0.03]"
                    }
                >
                    <Flag
                        className={`w-4 h-4 mr-1 ${isFlagged ? "fill-amber-400/30" : ""}`}
                    />
                    {isFlagged ? "Đã đánh dấu" : "Đánh dấu"}
                </Button>
            </CardHeader>
            <CardContent className="space-y-5">
                <p className="text-base md:text-lg text-white leading-relaxed font-medium">
                    {question.question}
                </p>

                {question.type === "multiple-choice" && question.options ? (
                    <div className="space-y-2">
                        {question.options.map((opt, optIndex) => (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() =>
                                    onSetAnswer({
                                        questionId: question.id,
                                        answer: opt.id,
                                        flagged,
                                    })
                                }
                                className={`${styles.optionBtn} w-full text-left rounded-xl border px-4 py-3 transition-all flex gap-3 items-start ${
                                    answer?.answer === opt.id
                                        ? styles.optionSelected
                                        : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-violet-500/35 hover:bg-violet-500/5"
                                }`}
                            >
                                <span
                                    className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${
                                        answer?.answer === opt.id
                                            ? "border-violet-400/60 bg-violet-500/30 text-white"
                                            : "border-white/15 bg-white/[0.06] text-slate-400"
                                    }`}
                                >
                                    {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span className="pt-0.5">{opt.text}</span>
                            </button>
                        ))}
                    </div>
                ) : null}

                {question.type === "true-false" ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Đúng", value: true as const },
                            { label: "Sai", value: false as const },
                        ].map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() =>
                                    onSetAnswer({
                                        questionId: question.id,
                                        answer: item.value,
                                        flagged,
                                    })
                                }
                                className={`${styles.optionBtn} rounded-xl border px-4 py-4 text-center font-bold transition-all ${
                                    answer?.answer === item.value
                                        ? styles.optionSelected
                                        : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-violet-500/35"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                ) : null}

                {question.type === "fill-in-the-blank" ? (
                    <input
                        type="text"
                        value={
                            typeof answer?.answer === "string"
                                ? answer.answer
                                : ""
                        }
                        onChange={(e) =>
                            onSetAnswer({
                                questionId: question.id,
                                answer: e.target.value,
                                flagged,
                            })
                        }
                        placeholder="Nhập đáp án của bạn..."
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    />
                ) : null}

                {question.type === "reading" ? (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 text-slate-300 whitespace-pre-wrap text-sm leading-relaxed max-h-48 overflow-y-auto">
                            {question.passage}
                        </div>
                        <div className="space-y-3">
                            {question.questions.map((sub, subIndex) => {
                                const subAnswer =
                                    answer?.subAnswers?.[sub.id] ?? null;
                                return (
                                    <div
                                        key={sub.id}
                                        className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                                    >
                                        <p className="text-sm text-slate-100 mb-3 font-medium">
                                            <span className="text-violet-400 mr-1">
                                                {subIndex + 1}.
                                            </span>
                                            {sub.question}
                                        </p>
                                        {sub.type === "multiple-choice" ? (
                                            <div className="space-y-2">
                                                {sub.options?.map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() =>
                                                            onSetAnswer({
                                                                questionId:
                                                                    question.id,
                                                                answer:
                                                                    answer?.answer ??
                                                                    null,
                                                                subAnswers: {
                                                                    ...(answer?.subAnswers ??
                                                                        {}),
                                                                    [sub.id]:
                                                                        opt.id,
                                                                },
                                                                flagged,
                                                            })
                                                        }
                                                        className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition-all ${
                                                            subAnswer === opt.id
                                                                ? styles.optionSelected
                                                                : "border-white/10 hover:border-violet-500/30 text-slate-300"
                                                        }`}
                                                    >
                                                        {opt.text}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : null}
                                        {sub.type === "true-false" ? (
                                            <div className="flex gap-2">
                                                {[
                                                    {
                                                        label: "Đúng",
                                                        value: true,
                                                    },
                                                    {
                                                        label: "Sai",
                                                        value: false,
                                                    },
                                                ].map((item) => (
                                                    <Button
                                                        key={item.label}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            onSetAnswer({
                                                                questionId:
                                                                    question.id,
                                                                answer:
                                                                    answer?.answer ??
                                                                    null,
                                                                subAnswers: {
                                                                    ...(answer?.subAnswers ??
                                                                        {}),
                                                                    [sub.id]:
                                                                        item.value,
                                                                },
                                                                flagged,
                                                            })
                                                        }
                                                        className={
                                                            subAnswer ===
                                                            item.value
                                                                ? "border-violet-400 bg-violet-500/20"
                                                                : ""
                                                        }
                                                    >
                                                        {item.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        ) : null}
                                        {sub.type === "fill-in-the-blank" ? (
                                            <input
                                                type="text"
                                                value={
                                                    typeof subAnswer ===
                                                    "string"
                                                        ? subAnswer
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    onSetAnswer({
                                                        questionId: question.id,
                                                        answer:
                                                            answer?.answer ??
                                                            null,
                                                        subAnswers: {
                                                            ...(answer?.subAnswers ??
                                                                {}),
                                                            [sub.id]:
                                                                e.target.value,
                                                        },
                                                        flagged,
                                                    })
                                                }
                                                placeholder="Đáp án..."
                                                className="w-full rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 focus:border-violet-500/40 focus:outline-none"
                                            />
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : null}

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onPrev}
                        disabled={!canPrev}
                        className="border-white/10"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Câu trước
                    </Button>
                    <Button
                        size="sm"
                        onClick={onNext}
                        disabled={!canNext}
                        className="bg-violet-600/80 hover:bg-violet-500 border-0"
                    >
                        Câu sau
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
