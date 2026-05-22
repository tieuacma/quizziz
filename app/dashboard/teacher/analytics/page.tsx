import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Puzzle, Target } from "lucide-react";
import { ANALYTICS_WEEKLY, QUIZZES, CLASSES } from "../data";

const maxSubmissions = Math.max(...ANALYTICS_WEEKLY.map((d) => d.submissions));

export default async function TeacherAnalyticsPage() {
  const session = await getSession();
  if (!session || session.role !== "teacher") redirect("/dashboard");

  const totalStudents = CLASSES.reduce((sum, c) => sum + c.students, 0);
  const avgScore =
    QUIZZES.filter((q) => q.status !== "draft").reduce((sum, q) => sum + q.avg, 0) /
    QUIZZES.filter((q) => q.status !== "draft").length;
  const completionRate = Math.round(
    (QUIZZES.reduce((sum, q) => sum + q.submissions, 0) /
      QUIZZES.reduce((sum, q) => sum + q.total, 0)) *
      100
  );

  const stats = [
    { label: "Học sinh", value: String(totalStudents), icon: Users, color: "text-amber-400" },
    { label: "Quiz hoạt động", value: String(QUIZZES.filter((q) => q.status === "active").length), icon: Puzzle, color: "text-emerald-400" },
    { label: "Điểm TB", value: avgScore.toFixed(1), icon: Target, color: "text-violet-400" },
    { label: "Tỷ lệ nộp bài", value: `${completionRate}%`, icon: TrendingUp, color: "text-blue-400" },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-primary" />
          Báo cáo
        </h1>
        <p className="text-slate-400 mt-1">
          Thống kê hiệu suất lớp học và hoạt động quiz trong tuần.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
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

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Lượt nộp theo ngày (tuần này)</h2>
        <Card className="bg-white/[0.03] border-white/8">
          <CardContent className="p-6">
            <div className="flex items-end justify-between gap-2 h-40">
              {ANALYTICS_WEEKLY.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-slate-500">{d.submissions}</span>
                  <div
                    className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-500 transition-all"
                    style={{ height: `${(d.submissions / maxSubmissions) * 100}%`, minHeight: "8px" }}
                  />
                  <span className="text-xs text-slate-400 font-medium">{d.day}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-4 text-center">
              Biểu đồ chi tiết sẽ được tích hợp khi kết nối dữ liệu thật.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Điểm trung bình theo ngày</h2>
        <Card className="bg-white/[0.03] border-white/8 overflow-hidden">
          {ANALYTICS_WEEKLY.map((d, i) => (
            <div
              key={d.day}
              className={`flex items-center justify-between px-5 py-3.5 ${
                i !== 0 ? "border-t border-white/8" : ""
              }`}
            >
              <span className="text-white text-sm font-medium w-8">{d.day}</span>
              <div className="flex-1 mx-4 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500"
                  style={{ width: `${(d.avg / 10) * 100}%` }}
                />
              </div>
              <span className="text-emerald-400 font-semibold text-sm w-12 text-right">
                {d.avg}/10
              </span>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
