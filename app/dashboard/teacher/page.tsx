import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { School, Users, BookText, Puzzle, PenLine, Plus, CalendarDays } from "lucide-react";

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
    <div className="space-y-8 max-w-5xl">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Xin chào, {session.name} 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Quản lý lớp học và tài nguyên giảng dạy của bạn.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/teacher/schedule">
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/8 text-white cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 mr-2" /> Thời khoá biểu
            </Button>
          </Link>
          <Button
            id="create-lesson-btn"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/20"
          >
            <PenLine className="w-4 h-4 mr-2" /> Tạo bài học
          </Button>
          <Link href="/quiz-create">
            <Button
              id="create-quiz-btn"
              variant="outline"
              className="border-white/10 hover:bg-white/8 text-white cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" /> Tạo Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <Card
            key={s.label}
            className="bg-white/[0.03] border-white/8 hover:bg-white/[0.06] transition-colors"
          >
            <CardContent className="p-5">
              <s.icon className={`w-6 h-6 ${s.color}`} />
              <p className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</p>
              <p className="text-slate-400 text-sm mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Classes */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <School className="w-5 h-5 text-primary" /> Lớp học của tôi
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {CLASSES.map((cls) => (
            <Card
              key={cls.id}
              className="bg-white/[0.03] border-white/8 hover:bg-white/[0.06] transition-colors cursor-pointer group"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm group-hover:text-violet-300 transition-colors">
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
                <p className="text-slate-400 text-xs flex items-center gap-1">
                  <BookText className="w-3 h-3" /> {cls.lesson}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Users className="w-3 h-3" /> {cls.students} học sinh
                  </span>
                  <span className="text-slate-400 text-xs">{cls.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Lessons */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookText className="w-5 h-5 text-primary" /> Bài học gần đây
        </h2>
        <Card className="bg-white/[0.03] border-white/8 overflow-hidden">
          {LESSONS.map((l, i) => (
            <div
              key={l.id}
              className={`flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors ${i !== 0 ? "border-t border-white/8" : ""}`}
            >
              <div>
                <p className="text-white text-sm font-medium">{l.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">
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

      {/* Quizzes */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-primary" /> Quiz gần đây
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {RECENT_QUIZZES.map((q) => (
            <Card
              key={q.id}
              className="bg-white/[0.03] border-white/8 hover:bg-white/[0.06] transition-colors"
            >
              <CardContent className="p-5">
                <h3 className="text-white font-medium text-sm">{q.title}</h3>
                <p className="text-slate-400 text-xs mt-1">📌 Lớp {q.class}</p>
                <div className="flex gap-4 mt-3 pt-3 border-t border-white/8">
                  <div>
                    <p className="text-slate-400 text-xs">Đã nộp</p>
                    <p className="text-white font-semibold">{q.submissions}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Điểm TB</p>
                    <p className="text-emerald-400 font-semibold">{q.avg}/10</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
