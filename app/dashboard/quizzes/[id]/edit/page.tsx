import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DashboardQuizEditRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/quiz-editor/${id}`);
}
