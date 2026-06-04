import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import TeacherDashboard from "@/components/dashboard/teacher/TeacherDashboard";

// Data with enhanced properties for the new dashboard
const CLASSES = [
  {
    id: 1,
    name: "Lập Trình Web - K22A",
    students: 38,
    lesson: "REST API Design",
    time: "T2, 7:30",
    status: "active" as const,
    progress: 65,
  },
  {
    id: 2,
    name: "Lập Trình Web - K22B",
    students: 35,
    lesson: "Authentication & JWT",
    time: "T4, 7:30",
    status: "active" as const,
    progress: 45,
  },
  {
    id: 3,
    name: "CSDL Nâng Cao - K21",
    students: 30,
    lesson: "Query Optimization",
    time: "T6, 13:00",
    status: "upcoming" as const,
    progress: 0,
  },
];

const RECENT_QUIZZES = [
  {
    id: 1,
    title: "HTTP Methods & Status Codes",
    class: "K22A",
    submissions: 32,
    avg: 8.1,
    trend: "up" as const,
  },
  {
    id: 2,
    title: "SQL Joins & Subqueries",
    class: "K21",
    submissions: 28,
    avg: 7.4,
    trend: "neutral" as const,
  },
];

const LESSONS = [
  {
    id: 1,
    title: "Giới thiệu Next.js App Router",
    class: "K22A",
    updatedAt: "26/04/2026",
    status: "published" as const,
    views: 156,
  },
  {
    id: 2,
    title: "Thiết kế ERD cho hệ thống lớn",
    class: "K21",
    updatedAt: "25/04/2026",
    status: "draft" as const,
    views: 0,
  },
  {
    id: 3,
    title: "JWT & Session Management",
    class: "K22B",
    updatedAt: "24/04/2026",
    status: "published" as const,
    views: 89,
  },
];

// Stats with icon names instead of components - the dashboard will map these
const STATS = [
  {
    label: "Lớp học",
    value: "3",
    icon: "School" as const,
    color: "text-blue-400",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    label: "Học sinh",
    value: "103",
    icon: "Users" as const,
    color: "text-amber-400",
    gradient: "from-amber-500 to-orange-500",
    trend: 12,
  },
  {
    label: "Bài học",
    value: "24",
    icon: "BookOpen" as const,
    color: "text-violet-400",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    label: "Quiz đã tạo",
    value: "8",
    icon: "Puzzle" as const,
    color: "text-emerald-400",
    gradient: "from-emerald-500 to-teal-500",
    trend: 25,
  },
];

export default async function TeacherPage() {
  const session = await getSession();
  if (!session || session.role !== "teacher") redirect("/dashboard");

  return (
    <TeacherDashboard
      session={{ name: session.name, role: session.role }}
      classes={CLASSES}
      recentQuizzes={RECENT_QUIZZES}
      lessons={LESSONS}
      stats={STATS}
    />
  );
}
