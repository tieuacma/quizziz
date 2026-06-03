import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import StudentSubpageHeader from "@/components/dashboard/student/StudentSubpageHeader";
import StudentTimetableWorkspace from "@/components/dashboard/student/StudentTimetableWorkspace";

export default async function StudentSchedulePage() {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/dashboard");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <StudentSubpageHeader
        title="Thời khoá biểu học tập"
        description="Xem lịch học theo từng thứ và khung giờ trong tuần."
        aside={
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-3 text-center sm:text-right min-w-[140px]">
            <p className="text-[11px] uppercase tracking-wider text-indigo-400/80 font-semibold">
              Lịch học
            </p>
            <p className="text-sm text-slate-300 mt-0.5">T2 – CN</p>
          </div>
        }
      />
      <StudentTimetableWorkspace />
    </div>
  );
}
