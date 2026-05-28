import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Puzzle, Plus, Users, BarChart3 } from "lucide-react";
import { QUIZZES } from "../data";

const STATUS_LABEL = {
  active: {
    text: "Đang mở",
    className: "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20",
  },
  closed: {
    text: "Đã đóng",
    className: "bg-slate-500/20 text-slate-400 hover:bg-slate-500/30",
  },
  draft: {
    text: "Nháp",
    className: "bg-amber-500/15 text-amber-400 hover:bg-amber-500/20",
  },
};

export default async function TeacherQuizziesPage() {
  const session = await getSession();
  if (!session || session.role !== "teacher") redirect("/dashboard");

  const active = QUIZZES.filter((q) => q.status === "active").length;
  const totalSubmissions = QUIZZES.reduce((sum, q) => sum + q.submissions, 0);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Puzzle className="w-7 h-7 text-primary" />
            Trắc nghiệm
          </h1>
          <p className="text-slate-400 mt-1">
            Quản lý quiz, theo dõi lượt nộp và điểm trung bình.
          </p>
        </div>
        <Link href="/quiz-create">
          <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/20 cursor-pointer">
            <Plus className="w-4 h-4 mr-2" /> Tạo Quiz mới
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white/[0.03] border-white/8">
          <CardContent className="p-5">
            <p className="text-3xl font-bold text-emerald-400">
              {QUIZZES.length}
            </p>
            <p className="text-slate-400 text-sm mt-0.5">Tổng quiz</p>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.03] border-white/8">
          <CardContent className="p-5">
            <p className="text-3xl font-bold text-violet-400">{active}</p>
            <p className="text-slate-400 text-sm mt-0.5">Đang mở</p>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.03] border-white/8 col-span-2 lg:col-span-1">
          <CardContent className="p-5">
            <p className="text-3xl font-bold text-amber-400">
              {totalSubmissions}
            </p>
            <p className="text-slate-400 text-sm mt-0.5">Lượt nộp (tổng)</p>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Danh sách quiz
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {QUIZZES.map((q) => {
            const status = STATUS_LABEL[q.status];
            return (
              <Card
                key={q.id}
                className="bg-white/[0.03] border-white/8 hover:bg-white/[0.06] transition-colors"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-white font-medium text-sm">
                      {q.title}
                    </h3>
                    <Badge className={status.className}>{status.text}</Badge>
                  </div>
                  <p className="text-slate-400 text-xs">
                    📌 Lớp {q.class} · {q.createdAt}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/8">
                    <Link href={`/quiz-editor/${q.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-white/15"
                      >
                        Sửa quiz
                      </Button>
                    </Link>
                    <Link href={`/quiz-game/${q.id}`} target="_blank">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-white/15"
                      >
                        Chơi thử
                      </Button>
                    </Link>
                    <Link href={`/do-exam/${q.id}`} target="_blank">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-white/15"
                      >
                        Thi thử
                      </Button>
                    </Link>
                  </div>
                  <div className="flex gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <div>
                        <p className="text-slate-400 text-xs">Đã nộp</p>
                        <p className="text-white font-semibold text-sm">
                          {q.submissions}/{q.total}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                      <div>
                        <p className="text-slate-400 text-xs">Điểm TB</p>
                        <p className="text-emerald-400 font-semibold text-sm">
                          {q.status === "draft" ? "—" : `${q.avg}/10`}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
