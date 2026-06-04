"use client";

import { Flag, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ExamAnswer } from "@/stores/exam-store";
import type { ExamQuizData } from "@/lib/getExamData";
import { isQuestionAnswered } from "./exam-utils";
import styles from "@/styles/exam.module.css";

type Props = {
	questions: ExamQuizData["questions"];
	currentQuestion: number;
	answers: Record<string, ExamAnswer>;
	flagged: Record<string, boolean>;
	answeredCount: number;
	onSelectQuestion: (index: number) => void;
	onSubmit: () => void;
};

export default function ExamSidebar({
	questions,
	currentQuestion,
	answers,
	flagged,
	answeredCount,
	onSelectQuestion,
	onSubmit,
}: Props) {
	const flaggedCount = Object.values(flagged).filter(Boolean).length;

	return (
		<Card className={`${styles.glassCard} h-fit lg:sticky lg:top-4`}>
			<CardHeader className="pb-3">
				<p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
					Bản đồ câu hỏi
				</p>
				<p className="text-xs text-slate-400">
					<span className="text-emerald-300 font-semibold">{answeredCount}</span>/
					{questions.length} hoàn thành
					{flaggedCount > 0 ? (
						<span className="text-amber-400/90"> · {flaggedCount} đánh dấu</span>
					) : null}
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-5 gap-2">
					{questions.map((q, index) => {
						const isFlag = Boolean(flagged[q.id]);
						const hasAnswer = isQuestionAnswered(q, answers[q.id]);
						const isCurrent = index === currentQuestion;
						return (
							<button
								key={q.id}
								type="button"
								onClick={() => onSelectQuestion(index)}
								className={`${styles.questionNavBtn} relative rounded-lg border px-1 py-2 text-xs font-semibold ${
									isCurrent
										? styles.optionNavCurrent
										: hasAnswer
											? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
											: "border-white/10 bg-white/[0.04] text-slate-400"
								}`}
								aria-label={`Câu ${index + 1}${isFlag ? ", đã đánh dấu" : ""}${hasAnswer ? ", đã trả lời" : ""}`}
								aria-current={isCurrent ? "true" : undefined}
							>
								{index + 1}
								{isFlag ? (
									<Flag className="w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-400 fill-amber-400/20" />
								) : null}
							</button>
						);
					})}
				</div>

				<div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
					<span className="inline-flex items-center gap-1">
						<span className={`w-2.5 h-2.5 rounded border ${styles.legendCurrent}`} />
						Đang làm
					</span>
					<span className="inline-flex items-center gap-1">
						<span className="w-2.5 h-2.5 rounded border border-emerald-500/40 bg-emerald-500/20" />
						Đã trả lời
					</span>
					<span className="inline-flex items-center gap-1">
						<span className="w-2.5 h-2.5 rounded border border-white/10 bg-white/[0.04]" />
						Chưa trả lời
					</span>
				</div>

				<Button
					className="zenith-btn-glow w-full rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 border-0"
					onClick={onSubmit}
				>
					<Send className="w-4 h-4 mr-2" />
					Nộp bài
				</Button>
			</CardContent>
		</Card>
	);
}
