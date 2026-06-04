import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { School, Users, BookText, Puzzle, PenLine, Plus, CalendarDays } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import WeeklySubmissionsChart from "@/components/dashboard/teacher/WeeklySubmissionsChart";

const CLASSES = [
  {
    id: 1,
    name: "Lập Trình Web - K22A",
    students: 38,
    lesson: "REST API Design",
    time: "T2, 7:30",
    status: "active",
  },
  {
    id: 2,
    name: "Lập Trình Web - K22B",
    students: 35,
    lesson: "Authentication & JWT",
    time: "T4, 7:30",
    status: "active",
  },
  {
    id: 3,
    name: "CSDL Nâng Cao - K21",
    students: 30,
    lesson: "Query Optimization",
    time: "T6, 13:00",
    status: "upcoming",
  },
];

const RECENT_QUIZZES = [
  {
    id: 1,
    title: "HTTP Methods & Status Codes",
    class: "K22A",
    submissions: 32,
    avg: 8.1,
  },
  {
    id: 2,
    title: "SQL Joins & Subqueries",
    class: "K21",
    submissions: 28,
    avg: 7.4,
  },
];

const LESSONS = [
  {
    id: 1,
    title: "Giới thiệu Next.js App Router",
    class: "K22A",
    updatedAt: "26/04/2026",
    status: "published",
  },
  {
    id: 2,
    title: "Thiết kế ERD cho hệ thống lớn",
    class: "K21",
    updatedAt: "25/04/2026",
    status: "draft",
  },
  {
    id: 3,
    title: "JWT & Session Management",
    class: "K22B",
    updatedAt: "24/04/2026",
    status: "published",
  },
];

const STATS = [
  { label: "Lớp học", value: "3", icon: School, color: "text-blue-400" },
  { label: "Học sinh", value: "103", icon: Users, color: "text-amber-400" },
  { label: "Bài học", value: "24", icon: BookText, color: "text-violet-400" },
  { label: "Quiz đã tạo", value: "8", icon: Puzzle, color: "text-emerald-400" },
];

export default async function TeacherPage() {
  const session = await getSession();
  if (!session || session.role !== "teacher") redirect("/dashboard");

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Xin chào, {session.name} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Quản lý lớp học và tài nguyên giảng dạy của bạn hôm nay.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/teacher/schedule">
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/8 text-white cursor-pointer text-xs"
            >
              <CalendarDays className="w-4 h-4 mr-2 text-indigo-400" /> Thời khoá biểu
            </Button>
          </Link>
          <Button
            id="create-lesson-btn"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/20 text-xs"
          >
            <PenLine className="w-4 h-4 mr-2" /> Tạo bài học
          </Button>
          <Link href="/quiz-create">
            <Button
              id="create-quiz-btn"
              variant="outline"
              className="border-white/10 hover:bg-white/8 text-white cursor-pointer text-xs"
            >
              <Plus className="w-4 h-4 mr-2 text-indigo-400" /> Tạo Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={<s.icon className={`w-6 h-6 ${s.color}`} />}
            valueClassName={s.color}
          />
        ))}
      </div>

      {/* Reorganized Columns */}
      <div className="grid lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Column: Classes & Lessons (takes 2/3 space) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Classes */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <School className="w-5 h-5 text-indigo-400" /> Lớp học của tôi
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {CLASSES.map((cls) => (
                <Card
                  key={cls.id}
                  className="bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-white/15 transition-all cursor-pointer group hover:shadow-[0_8px_30px_rgba(99,102,241,0.04)]"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm group-hover:text-indigo-300 transition-colors">
                        {cls.name}
                      </h3>
                      <Badge
                        className={
                          cls.status === "active"
                            ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-blue-500/15 text-blue-400 hover:bg-blue-500/20"
                        }
                      >
                        {cls.status === "active" ? "Đang dạy" : "Sắp tới"}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-2">
                      <BookText className="w-3.5 h-3.5 text-indigo-400" /> {cls.lesson}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
                      <span className="text-slate-400 text-xs flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-400" /> {cls.students} học sinh
                      </span>
                      <span className="text-slate-400 text-xs font-semibold">{cls.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Lessons */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookText className="w-5 h-5 text-indigo-400" /> Bài học gần đây
            </h2>
            <Card className="bg-white/[0.03] border-white/8 overflow-hidden hover:border-white/15 transition-colors">
              {LESSONS.map((l, i) => (
                <div
                  key={l.id}
                  className={`flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors ${i !== 0 ? "border-t border-white/8" : ""}`}
                >
                  <div>
                    <p className="text-white text-sm font-medium">{l.title}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      📌 {l.class} · Cập nhật {l.updatedAt}
                    </p>
                  </div>
                  <Badge
                    className={
                      l.status === "published"
                        ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-slate-500/20 text-slate-400 hover:bg-slate-500/30"
                    }
                  >
                    {l.status === "published" ? "Đã đăng" : "Nháp"}
                  </Badge>
                </div>
              ))}
            </Card>
          </section>
        </div>

        {/* Right Column: Weekly Analytics & Quizzes (takes 1/3 space) */}
        <div className="lg:col-span-1 space-y-8 flex flex-col justify-start">
          {/* Chart */}
          <section className="flex-1 min-h-[300px]">
            <WeeklySubmissionsChart />
          </section>

          {/* Quizzes */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Puzzle className="w-5 h-5 text-indigo-400" /> Quiz gần đây
            </h2>
            <div className="space-y-4">
              {RECENT_QUIZZES.map((q) => (
                <Card
                  key={q.id}
                  className="bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-white/15 transition-all group"
                >
                  <CardContent className="p-5">
                    <h3 className="text-white font-medium text-sm group-hover:text-indigo-300 transition-colors">{q.title}</h3>
                    <p className="text-slate-400 text-xs mt-1.5">📌 Lớp {q.class}</p>
                    <div className="flex gap-6 mt-4 pt-3 border-t border-white/8">
                      <div>
                        <p className="text-slate-500 text-[9px] uppercase font-bold tracking-wider">Đã nộp</p>
                        <p className="text-white font-bold mt-0.5 text-sm">{q.submissions}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[9px] uppercase font-bold tracking-wider">Điểm TB</p>
                        <p className="text-emerald-400 font-bold mt-0.5 text-sm">{q.avg}/10</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
