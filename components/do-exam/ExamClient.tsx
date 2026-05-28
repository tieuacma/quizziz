"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flag, Timer, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { submitExamAction, type SubmitExamResult } from "@/app/actions/submit-exam-action";
import type { ExamQuizData } from "@/lib/getExamData";
import { useExamStore } from "@/stores/exam-store";
import {
	animateQuestionTransition,
	animateResultRows,
	animateSidebarIn,
	animateTimerWarning,
} from "@/lib/gsap-presets";
import styles from "@/styles/exam.module.css";

gsap.registerPlugin(useGSAP);

type Props = {
	quizId: string;
	metadata: ExamQuizData["metadata"];
	questions: ExamQuizData["questions"];
};

function toClock(totalSeconds: number): string {
	const mins = Math.floor(totalSeconds / 60);
	const secs = totalSeconds % 60;
	return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function ExamClient({ quizId, metadata, questions }: Props) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const sidebarRef = useRef<HTMLDivElement | null>(null);
	const questionRef = useRef<HTMLDivElement | null>(null);
	const timerRef = useRef<HTMLDivElement | null>(null);
	const resultRef = useRef<HTMLDivElement | null>(null);

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

	const examTimeLimit = metadata.examTimeLimit ?? 1800;
	const current = questions[currentQuestion];
	const answeredCount = useMemo(
		() => Object.keys(answers).length,
		[answers],
	);

	useEffect(() => {
		setExam(quizId, Date.now());
	}, [quizId, setExam]);

	const remainingSeconds = useMemo(() => {
		if (!startTime || now === 0) return examTimeLimit;
		const elapsed = Math.floor((now - startTime) / 1000);
		return Math.max(0, examTimeLimit - elapsed);
	}, [now, startTime, examTimeLimit]);

	const submit = useCallback(async (auto = false) => {
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
			if (auto) setAutoSubmitted(true);
			if (response.success) reset();
			if (!auto) setConfirmSubmit(false);
		} finally {
			setSubmitting(false);
		}
	}, [answers, autoSubmitted, quizId, reset, result, startTime, submitting]);

	useEffect(() => {
		submitRef.current = submit;
		autoSubmittedRef.current = autoSubmitted;
		submittingRef.current = submitting;
		hasResultRef.current = result;
	}, [submit, autoSubmitted, submitting, result]);

	useEffect(() => {
		if (result) return;

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
	}, [result, startTime, examTimeLimit]);

	useGSAP(
		() => {
			if (sidebarRef.current) animateSidebarIn(sidebarRef.current);
		},
		{ scope: rootRef },
	);

	useGSAP(
		() => {
			if (questionRef.current) animateQuestionTransition(questionRef.current);
		},
		{ scope: questionRef, dependencies: [currentQuestion] },
	);

	useGSAP(
		() => {
			if (timerRef.current && remainingSeconds <= 300) {
				animateTimerWarning(timerRef.current);
			}
		},
		{ scope: timerRef, dependencies: [remainingSeconds] },
	);

	useGSAP(
		() => {
			if (!resultRef.current) return;
			const rows = Array.from(resultRef.current.querySelectorAll("[data-result-row='1']"));
			if (rows.length > 0) animateResultRows(rows);
		},
		{ scope: resultRef, dependencies: [result?.success] },
	);

	if (!current) {
		return (
			<div className={`${styles.examRoot} flex items-center justify-center text-slate-300`}>
				Đề thi chưa có câu hỏi.
			</div>
		);
	}

	return (
		<div ref={rootRef} className={`${styles.examRoot} px-4 py-6`}>
			<div className="max-w-7xl mx-auto">
				<div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-4">
					<div ref={sidebarRef}>
					<Card className={styles.glassCard}>
						<CardHeader className="pb-3">
							<h1 className="text-lg font-semibold text-white">{metadata.title}</h1>
							<p className="text-xs text-slate-400">
								{answeredCount}/{questions.length} đã trả lời
							</p>
							<div ref={timerRef} className="flex items-center gap-2 text-cyan-300 font-semibold">
								<Timer className="w-4 h-4" />
								{toClock(remainingSeconds)}
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-5 gap-2">
								{questions.map((q, index) => {
									const isFlag = Boolean(flagged[q.id]);
									const hasAnswer = Boolean(answers[q.id]);
									const isCurrent = index === currentQuestion;
									return (
										<button
											key={q.id}
											type="button"
											onClick={() => setCurrentQuestion(index)}
											className={`${styles.questionNavBtn} rounded-lg border px-2 py-2 text-xs ${
												isCurrent
													? "border-cyan-400 bg-cyan-400/20 text-white"
													: hasAnswer
														? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
														: "border-white/10 bg-slate-900/50 text-slate-300"
											}`}
										>
											{index + 1}
											{isFlag ? <Flag className="w-3 h-3 inline ml-1 text-amber-400" /> : null}
										</button>
									);
								})}
							</div>
							<Button className="w-full mt-4" onClick={() => setConfirmSubmit(true)}>
								<Send className="w-4 h-4 mr-2" />
								Nộp bài
							</Button>
						</CardContent>
					</Card>
					</div>

					<div ref={questionRef}>
					<Card className={styles.glassCard}>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<p className="text-xs text-slate-400">Câu {currentQuestion + 1}</p>
								<p className="text-sm text-slate-300">{current.type}</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => toggleFlag(current.id)}
								className={flagged[current.id] ? "border-amber-400 text-amber-300" : ""}
							>
								<Flag className="w-4 h-4 mr-1" />
								Đánh dấu
							</Button>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-white">{current.question}</p>
							{current.type === "multiple-choice" && current.options ? (
								<div className="space-y-2">
									{current.options.map((opt) => (
										<button
											key={opt.id}
											type="button"
											onClick={() =>
												setAnswer({ questionId: current.id, answer: opt.id, flagged: flagged[current.id] })
											}
											className={`w-full text-left rounded-lg border px-3 py-2 ${
												answers[current.id]?.answer === opt.id
													? "border-cyan-400 bg-cyan-500/20 text-white"
													: "border-white/10 bg-slate-900/40 text-slate-300"
											}`}
										>
											{opt.text}
										</button>
									))}
								</div>
							) : null}
							{current.type === "true-false" ? (
								<div className="flex gap-2">
									{[
										{ label: "Đúng", value: true },
										{ label: "Sai", value: false },
									].map((item) => (
										<Button
											key={item.label}
											variant="outline"
											onClick={() =>
												setAnswer({
													questionId: current.id,
													answer: item.value,
													flagged: flagged[current.id],
												})
											}
											className={
												answers[current.id]?.answer === item.value
													? "border-cyan-400 bg-cyan-500/20"
													: ""
											}
										>
											{item.label}
										</Button>
									))}
								</div>
							) : null}
							{current.type === "fill-in-the-blank" ? (
								<input
									type="text"
									value={typeof answers[current.id]?.answer === "string" ? (answers[current.id]?.answer as string) : ""}
									onChange={(e) =>
										setAnswer({
											questionId: current.id,
											answer: e.target.value,
											flagged: flagged[current.id],
										})
									}
									placeholder="Nhập đáp án..."
									className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-slate-100"
								/>
							) : null}
							{current.type === "reading" ? (
								<div className="space-y-4">
									<div className="rounded-lg border border-white/10 bg-slate-900/40 p-3 text-slate-300 whitespace-pre-wrap">
										{current.passage}
									</div>
									<div className="space-y-3">
										{current.questions.map((sub, subIndex) => {
											const subAnswer = answers[current.id]?.subAnswers?.[sub.id] ?? null;
											return (
												<div key={sub.id} className="rounded-lg border border-white/10 p-3">
													<p className="text-sm text-slate-200 mb-2">
														{subIndex + 1}. {sub.question}
													</p>
													{sub.type === "multiple-choice" ? (
														<div className="space-y-2">
															{sub.options?.map((opt) => (
																<button
																	key={opt.id}
																	type="button"
																	onClick={() =>
																		setAnswer({
																			questionId: current.id,
																			answer: answers[current.id]?.answer ?? null,
																			subAnswers: {
																				...(answers[current.id]?.subAnswers ?? {}),
																				[sub.id]: opt.id,
																			},
																			flagged: flagged[current.id],
																		})
																	}
																	className={`w-full text-left rounded border px-2 py-1 text-sm ${
																		subAnswer === opt.id
																			? "border-cyan-400 bg-cyan-500/20"
																			: "border-white/10"
																	}`}
																>
																	{opt.text}
																</button>
															))}
														</div>
													) : null}
													{sub.type === "true-false" ? (
														<div className="flex gap-2">
															<Button
																variant="outline"
																onClick={() =>
																	setAnswer({
																		questionId: current.id,
																		answer: answers[current.id]?.answer ?? null,
																		subAnswers: {
																			...(answers[current.id]?.subAnswers ?? {}),
																			[sub.id]: true,
																		},
																		flagged: flagged[current.id],
																	})
																}
															>
																Đúng
															</Button>
															<Button
																variant="outline"
																onClick={() =>
																	setAnswer({
																		questionId: current.id,
																		answer: answers[current.id]?.answer ?? null,
																		subAnswers: {
																			...(answers[current.id]?.subAnswers ?? {}),
																			[sub.id]: false,
																		},
																		flagged: flagged[current.id],
																	})
																}
															>
																Sai
															</Button>
														</div>
													) : null}
													{sub.type === "fill-in-the-blank" ? (
														<input
															type="text"
															value={typeof subAnswer === "string" ? subAnswer : ""}
															onChange={(e) =>
																setAnswer({
																	questionId: current.id,
																	answer: answers[current.id]?.answer ?? null,
																	subAnswers: {
																		...(answers[current.id]?.subAnswers ?? {}),
																		[sub.id]: e.target.value,
																	},
																	flagged: flagged[current.id],
																})
															}
															className="w-full rounded border border-white/10 bg-slate-900/40 px-2 py-1 text-sm"
														/>
													) : null}
												</div>
											);
										})}
									</div>
								</div>
							) : null}
						</CardContent>
					</Card>
					</div>
				</div>
			</div>

			{confirmSubmit ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
					<div className={`${styles.glassCard} w-full max-w-md p-5`}>
						<h3 className="text-lg text-white font-semibold mb-2">Xác nhận nộp bài</h3>
						<p className="text-sm text-slate-300 mb-4">
							Bạn đã trả lời {answeredCount}/{questions.length} câu. Sau khi nộp sẽ không thể sửa.
						</p>
						<div className="flex gap-2">
							<Button variant="outline" className="flex-1" onClick={() => setConfirmSubmit(false)}>
								Hủy
							</Button>
							<Button className="flex-1" disabled={submitting} onClick={() => void submit()}>
								{submitting ? "Đang nộp..." : "Nộp ngay"}
							</Button>
						</div>
					</div>
				</div>
			) : null}

			{result?.success ? (
				<div className="fixed inset-0 z-50 overflow-auto bg-slate-950/95 px-4 py-8">
					<div ref={resultRef} className="max-w-3xl mx-auto space-y-3">
						<Card className={styles.glassCard}>
							<CardHeader>
								<h2 className="text-xl text-white font-semibold">Kết quả bài thi</h2>
								<p className="text-slate-300">
									Điểm: {Math.round(result.score ?? 0)}% · Đúng {result.correctCount}/{result.totalQuestions}
								</p>
							</CardHeader>
						</Card>
						{result.items?.map((item, idx) => (
							<div
								key={item.questionId}
								data-result-row="1"
								className={`rounded-lg border px-4 py-3 ${item.correct ? "border-emerald-500/30 bg-emerald-500/10" : "border-rose-500/30 bg-rose-500/10"}`}
							>
								<p className="text-sm text-slate-100">
									Câu {idx + 1}: {item.correct ? "Đúng" : "Sai"}
								</p>
								{item.explanation ? (
									<p className="text-xs text-slate-300 mt-1">{item.explanation}</p>
								) : null}
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
}
