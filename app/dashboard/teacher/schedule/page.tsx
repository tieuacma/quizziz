import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import TeacherSubpageHeader from "@/components/dashboard/teacher/TeacherSubpageHeader";
import TeacherScheduleWorkspace from "@/components/dashboard/teacher/TeacherScheduleWorkspace";

export default async function TeacherSchedulePage() {
    const session = await getSession();
    if (!session || session.role !== "teacher") redirect("/dashboard");

    return (
        <div className="mx-auto w-full max-w-6xl space-y-8">
            <TeacherSubpageHeader
                title="Thời khoá biểu giảng dạy"
                description="Tạo tiết học và quản lý lịch dạy theo từng thứ trong tuần."
                aside={
                    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 px-5 py-3 text-center sm:text-right min-w-[140px]">
                        <p className="text-[11px] uppercase tracking-wider text-violet-400/80 font-semibold">
                            Lịch dạy
                        </p>
                        <p className="text-sm text-slate-300 mt-0.5">T2 – CN</p>
                    </div>
                }
            />
            <TeacherScheduleWorkspace />
        </div>
    );
}
