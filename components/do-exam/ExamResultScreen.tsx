"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import type { SubmitExamResult } from "@/app/actions/submit-exam-action";
import { animateResultRows } from "@/lib/gsap-presets";
import { formatDuration, scoreGrade } from "./exam-utils";
import styles from "@/styles/exam.module.css";

gsap.registerPlugin(useGSAP);

type Props = {
	result: SubmitExamResult;
	autoSubmitted?: boolean;
	onRetry?: () => void;
};

export default function ExamResultScreen({ result, autoSubmitted, onRetry }: Props) {
	const resultRef = useRef<HTMLDivElement | null>(null);
	const score = Math.round(result.score ?? 0);
	const grade = scoreGrade(score);
	const duration = result.durationSeconds ?? 0;

	useGSAP(
		() => {
			if (!resultRef.current) return;
			const rows = Array.from(resultRef.current.querySelectorAll("[data-result-row='1']"));
			if (rows.length > 0) animateResultRows(rows);
		},
		{ scope: resultRef, dependencies: [result.success] },
	);

	const gradeTextClass = {
		emerald: "text-emerald-300",
		sky: "text-sky-300",
		amber: "text-amber-300",
		rose: "text-rose-300",
	}[grade.tone];

	return (
		<div className="fixed inset-0 z-50 overflow-auto zenith-immersive bg-[#030208]/98 px-4 py-8">
			<div className="pointer-events-none absolute inset-0 zenith-grid opacity-30" />
			<div ref={resultRef} className="relative z-10 max-w-3xl mx-auto space-y-4">
				<Card className={`${styles.glassCard} overflow-hidden`}>
					<CardHeader className="text-center pb-2">
						{autoSubmitted ? (
							<p className="text-xs text-amber-300/90 font-semibold uppercase tracking-wider mb-2">
								Hết giờ — đã tự động nộp bài
							</p>
						) : null}
						<h2 className="font-display text-2xl text-white font-bold mb-6">Kết quả bài thi</h2>

						<div className="relative mx-auto w-36 h-36 mb-4">
							<svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
								<circle
									cx="60"
									cy="60"
									r="52"
									fill="none"
									stroke="rgba(255,255,255,0.08)"
									strokeWidth="10"
								/>
								<circle
									cx="60"
									cy="60"
									r="52"
									fill="none"
									stroke="url(#scoreGradient)"
									strokeWidth="10"
									strokeLinecap="round"
									strokeDasharray={`${(score / 100) * 327} 327`}
									className="transition-all duration-700"
								/>
								<defs>
									<linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" stopColor="#8b5cf6" />
										<stop offset="100%" stopColor="#d946ef" />
									</linearGradient>
								</defs>
							</svg>
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<span className="text-4xl font-black text-white tabular-nums">{score}%</span>
								<span className={`text-xs font-bold uppercase tracking-wider mt-1 ${gradeTextClass}`}>
									{grade.label}
								</span>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
							<div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2">
								<p className="text-[10px] text-emerald-300/70 uppercase font-bold">Đúng</p>
								<p className="text-lg font-bold text-emerald-200">{result.correctCount}</p>
							</div>
							<div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2">
								<p className="text-[10px] text-rose-300/70 uppercase font-bold">Sai</p>
								<p className="text-lg font-bold text-rose-200">
									{(result.totalQuestions ?? 0) - (result.correctCount ?? 0)}
								</p>
							</div>
							<div className="rounded-xl border border-violet-500/25 bg-violet-500/10 px-3 py-2">
								<p className="text-[10px] text-violet-300/70 uppercase font-bold">Thời gian</p>
								<p className="text-sm font-bold text-violet-100 leading-tight pt-0.5">
									{formatDuration(duration)}
								</p>
							</div>
						</div>
					</CardHeader>
				</Card>

				<p className="text-xs text-slate-500 uppercase tracking-wider font-bold px-1">
					Chi tiết từng câu
				</p>

				{result.items?.map((item, idx) => (
					<div
						key={item.questionId}
						data-result-row="1"
						className={`rounded-xl border px-4 py-3 flex gap-3 ${
							item.correct
								? "border-emerald-500/30 bg-emerald-500/10"
								: "border-rose-500/30 bg-rose-500/10"
						}`}
					>
						{item.correct ? (
							<CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
						) : (
							<XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
						)}
						<div className="min-w-0">
							<p className="text-sm text-slate-100 font-medium">
								Câu {idx + 1}: {item.correct ? "Đúng" : "Sai"}
							</p>
							{item.explanation ? (
								<p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.explanation}</p>
							) : null}
						</div>
					</div>
				))}

				<div className="flex flex-col sm:flex-row gap-2 pt-4">
					{onRetry ? (
						<Button
							variant="outline"
							className="flex-1 border-white/15"
							onClick={onRetry}
						>
							<RotateCcw className="w-4 h-4 mr-2" />
							Làm lại
						</Button>
					) : null}
					<Button
						asChild
						className="zenith-btn-glow flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 border-0"
					>
						<Link href="/dashboard/teacher/quizzies">Về danh sách Quiz</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
