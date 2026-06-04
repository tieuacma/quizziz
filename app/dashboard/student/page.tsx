import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  CalendarDays,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";
import StatCard from "@/components/dashboard/StatCard";
import CourseCard from "@/components/dashboard/student/CourseCard";
import AssignmentsPanel from "@/components/dashboard/student/AssignmentsPanel";
import LearningResultsPanel from "@/components/dashboard/student/LearningResultsPanel";
import StudentScheduleCheck from "@/components/dashboard/student/StudentScheduleCheck";
import NextLessonBanner from "@/components/dashboard/student/NextLessonBanner";
import { ASSIGNMENTS, COURSES, LEARNING_RESULTS } from "./data";

function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
    >
      {label}
      <ChevronRight className="w-3.5 h-3.5" />
    </Link>
  );
}

export default async function StudentPage() {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/dashboard");

  const pendingCount = ASSIGNMENTS.filter((a) => a.status === "pending").length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Xin chào, {session.name} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Tổng quan học tập và lịch học của bạn hôm nay.
          </p>
        </div>
      </div>

      {/* Next Lesson Smart Alert Banner */}
      <NextLessonBanner />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Môn học",
            value: String(COURSES.length),
            icon: "📚",
            color: "text-blue-400",
          },
          {
            label: "Bài tập",
            value: String(pendingCount),
            icon: "📝",
            color: "text-amber-400",
          },
          {
            label: "Điểm TB",
            value: "3.6",
            icon: "🏆",
            color: "text-emerald-400",
          },
          {
            label: "Điểm danh",
            value: "94%",
            icon: "✅",
            color: "text-violet-400",
          },
        ].map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={s.icon}
            valueClassName={s.color}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
        <section className="lg:col-span-2 flex flex-col min-h-0">
          <SectionHeader
            icon={BookOpen}
            title="My Courses"
            right={
              <SectionLink
                href="/dashboard/student/my-courses"
                label="Xem tất cả"
              />
            }
          />
          <div className="grid sm:grid-cols-2 gap-4 flex-1">
            {COURSES.slice(0, 2).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>

        <section className="lg:col-span-1 flex flex-col min-h-0">
          <SectionHeader
            icon={GraduationCap}
            title="Learning Results"
            right={
              <SectionLink
                href="/dashboard/student/learning-results"
                label="Xem tất cả"
              />
            }
          />
          <div className="flex-1 min-h-[240px] lg:min-h-0">
            <LearningResultsPanel results={LEARNING_RESULTS.slice(0, 3)} />
          </div>
        </section>

        <section className="lg:col-span-2 flex flex-col min-h-0">
          <SectionHeader
            icon={ClipboardList}
            title="Assignments"
            right={
              <SectionLink
                href="/dashboard/student/assignments"
                label="Xem tất cả"
              />
            }
          />
          <AssignmentsPanel assignments={ASSIGNMENTS.slice(0, 2)} />
        </section>

        <section className="lg:col-span-1 flex flex-col min-h-0">
          <SectionHeader
            icon={CalendarDays}
            title="Schedule"
            right={
              <SectionLink
                href="/dashboard/student/schedule"
                label="Xem tất cả"
              />
            }
          />
          <div className="flex-1 min-h-[240px] lg:min-h-0">
            <StudentScheduleCheck />
          </div>
        </section>
      </div>
    </div>
  );
}
