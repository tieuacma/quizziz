import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, School, Mail } from "lucide-react";
import { CLASSES, STUDENTS } from "../data";

export default async function TeacherStudentsPage() {
  const session = await getSession();
  if (!session || session.role !== "teacher") redirect("/dashboard");

  const totalStudents = CLASSES.reduce((sum, c) => sum + c.students, 0);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-7 h-7 text-primary" />
          Học sinh
        </h1>
        <p className="text-slate-400 mt-1">
          Quản lý danh sách học sinh theo lớp và theo dõi tiến độ.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white/[0.03] border-white/8">
          <CardContent className="p-5">
            <p className="text-3xl font-bold text-amber-400">{totalStudents}</p>
            <p className="text-slate-400 text-sm mt-0.5">Tổng học sinh</p>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.03] border-white/8">
          <CardContent className="p-5">
            <p className="text-3xl font-bold text-blue-400">{CLASSES.length}</p>
            <p className="text-slate-400 text-sm mt-0.5">Lớp đang dạy</p>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.03] border-white/8 col-span-2 lg:col-span-1">
          <CardContent className="p-5">
            <p className="text-3xl font-bold text-emerald-400">7.9</p>
            <p className="text-slate-400 text-sm mt-0.5">Điểm TB hệ thống</p>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <School className="w-5 h-5 text-primary" /> Theo lớp
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {CLASSES.map((cls) => (
            <Card
              key={cls.id}
              className="bg-white/[0.03] border-white/8 hover:bg-white/[0.06] transition-colors"
            >
              <CardContent className="p-5">
                <h3 className="text-white font-semibold text-sm">{cls.name}</h3>
                <p className="text-slate-400 text-xs mt-1">{cls.lesson}</p>
                <p className="text-amber-400 font-bold text-2xl mt-3">
                  {cls.students}
                </p>
                <p className="text-slate-500 text-xs">học sinh</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Danh sách học sinh
        </h2>
        <Card className="bg-white/[0.03] border-white/8 overflow-hidden">
          {STUDENTS.map((s, i) => (
            <div
              key={s.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-white/5 transition-colors ${
                i !== 0 ? "border-t border-white/8" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">{s.name}</p>
                <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1 truncate">
                  <Mail className="w-3 h-3 shrink-0" /> {s.email}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge className="bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/20">
                  {s.class}
                </Badge>
                <div className="text-right">
                  <p className="text-emerald-400 font-semibold text-sm">
                    {s.avg}/10
                  </p>
                  <p className="text-slate-500 text-xs">{s.quizzesDone} quiz</p>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
