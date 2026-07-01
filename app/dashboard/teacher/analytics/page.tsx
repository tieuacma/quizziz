import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ANALYTICS_WEEKLY, QUIZZES, CLASSES } from "../data";
import AnimatedAnalyticsPage from "@/components/dashboard/teacher/AnimatedAnalyticsPage";

export default async function TeacherAnalyticsPage() {
    const session = await getSession();
    if (!session || session.role !== "teacher") redirect("/dashboard");

    const totalStudents = CLASSES.reduce((sum, c) => sum + c.students, 0);
    const avgScore =
        QUIZZES.filter((q) => q.status !== "draft").reduce(
            (sum, q) => sum + q.avg,
            0
        ) / QUIZZES.filter((q) => q.status !== "draft").length;
    const completionRate = Math.round(
        (QUIZZES.reduce((sum, q) => sum + q.submissions, 0) /
            QUIZZES.reduce((sum, q) => sum + q.total, 0)) *
            100
    );

    const stats = [
        {
            label: "Học sinh",
            value: String(totalStudents),
            icon: "Users" as const,
            color: "text-amber-400",
        },
        {
            label: "Quiz hoạt động",
            value: String(QUIZZES.filter((q) => q.status === "active").length),
            icon: "Puzzle" as const,
            color: "text-emerald-400",
        },
        {
            label: "Điểm TB",
            value: avgScore.toFixed(1),
            icon: "Target" as const,
            color: "text-violet-400",
        },
        {
            label: "Tỷ lệ nộp bài",
            value: `${completionRate}%`,
            icon: "TrendingUp" as const,
            color: "text-blue-400",
        },
    ];

    return (
        <AnimatedAnalyticsPage
            stats={stats}
            analyticsWeekly={ANALYTICS_WEEKLY}
        />
    );
}
