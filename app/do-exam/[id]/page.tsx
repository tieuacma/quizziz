import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getExamData } from "@/lib/getExamData";
import ExamClient from "@/components/do-exam/ExamClient";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const quiz = await getExamData(id);
	if (!quiz) {
		return { title: "Đề thi không tồn tại" };
	}

	return {
		title: `Thi thử: ${quiz.metadata.title}`,
		description: quiz.metadata.description ?? "Chế độ thi bảo mật, chấm điểm server-side.",
	};
}

export default async function DoExamPage({ params }: Props) {
	const { id } = await params;
	const quiz = await getExamData(id);
	if (!quiz) notFound();

	return <ExamClient quizId={quiz.id} metadata={quiz.metadata} questions={quiz.questions} />;
}
