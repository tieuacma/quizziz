import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { QUIZZES } from "../data";
import AnimatedQuizzesPage from "@/components/dashboard/teacher/AnimatedQuizzesPage";

export default async function TeacherQuizziesPage() {
  const session = await getSession();
  if (!session || session.role !== "teacher") redirect("/dashboard");

  const active = QUIZZES.filter((q) => q.status === "active").length;
  const totalSubmissions = QUIZZES.reduce((sum, q) => sum + q.submissions, 0);

  return (
    <AnimatedQuizzesPage
      quizzes={QUIZZES}
      activeCount={active}
      totalSubmissions={totalSubmissions}
    />
  );
}
