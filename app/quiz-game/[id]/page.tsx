import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getQuizById } from "@/lib/quiz-service";
import QuizGame from "@/components/quiz-game/QuizGame";
import { QuizData } from "@/types/quiz";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getQuizById(id);

  if (!data) {
    return {
      title: "Bài Quiz không tồn tại",
    };
  }

  return {
    title: `Đang chơi: ${data.metadata.title}`,
    description:
      data.metadata.description ||
      `Chơi quiz ${data.metadata.title} với ${data.metadata.totalQuestions} câu hỏi`,
  };
}

export async function generateStaticParams() {
  const data = await getQuizById("017241f6-562d-4887-a5b1-dc4369016c1f");
  if (!data) return [];

  return [{ id: data.metadata.id }];
}

export default async function QuizDetailPage({ params }: Props) {
  const { id } = await params;
  const data: QuizData | null = await getQuizById(id);

  if (!data) {
    notFound();
  }

  return (
    <QuizGame
      profileId="guest-user"
      quizId={id}
      initialQuestions={data.questions}
    />
  );
}
