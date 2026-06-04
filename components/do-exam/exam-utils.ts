import type { ExamAnswer } from "@/stores/exam-store";
import type { ExamQuizData } from "@/lib/getExamData";

export type ExamQuestion = ExamQuizData["questions"][number];

export function toClock(totalSeconds: number): string {
	const mins = Math.floor(totalSeconds / 60);
	const secs = totalSeconds % 60;
	return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function formatDuration(totalSeconds: number): string {
	const mins = Math.floor(totalSeconds / 60);
	const secs = totalSeconds % 60;
	if (mins === 0) return `${secs} giây`;
	if (secs === 0) return `${mins} phút`;
	return `${mins} phút ${secs} giây`;
}

export function questionTypeLabel(type: ExamQuestion["type"]): string {
	switch (type) {
		case "multiple-choice":
			return "Trắc nghiệm";
		case "true-false":
			return "Đúng / Sai";
		case "fill-in-the-blank":
			return "Điền khuyết";
		case "reading":
			return "Đọc hiểu";
		default:
			return type;
	}
}

export function isQuestionAnswered(
	question: ExamQuestion,
	answer?: ExamAnswer,
): boolean {
	if (!answer) return false;

	switch (question.type) {
		case "multiple-choice":
		case "true-false":
			return answer.answer !== null && answer.answer !== undefined;
		case "fill-in-the-blank":
			return typeof answer.answer === "string" && answer.answer.trim().length > 0;
		case "reading":
			return question.questions.every((sub) => {
				const subAns = answer.subAnswers?.[sub.id];
				if (subAns === null || subAns === undefined) return false;
				if (sub.type === "fill-in-the-blank") {
					return typeof subAns === "string" && subAns.trim().length > 0;
				}
				return true;
			});
		default:
			return false;
	}
}

export function countAnswered(
	questions: ExamQuestion[],
	answers: Record<string, ExamAnswer>,
): number {
	return questions.filter((q) => isQuestionAnswered(q, answers[q.id])).length;
}

export function scoreGrade(score: number): {
	label: string;
	tone: "emerald" | "sky" | "amber" | "rose";
} {
	if (score >= 90) return { label: "Xuất sắc", tone: "emerald" };
	if (score >= 70) return { label: "Khá", tone: "sky" };
	if (score >= 50) return { label: "Trung bình", tone: "amber" };
	return { label: "Cần cố gắng", tone: "rose" };
}
