import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";
import AssignmentsPanel from "@/components/dashboard/student/AssignmentsPanel";
import StudentSubpageHeader from "@/components/dashboard/student/StudentSubpageHeader";
import { ASSIGNMENTS } from "@/app/dashboard/student/data";

export default async function AssignmentsPage() {
    const session = await getSession();
    if (!session || session.role !== "student") redirect("/dashboard");

    const pending = ASSIGNMENTS.filter((a) => a.status === "pending");
    const submitted = ASSIGNMENTS.filter((a) => a.status === "submitted");

    return (
        <div className="mx-auto w-full max-w-6xl space-y-8">
            <StudentSubpageHeader
                title="Assignments"
                description={`${pending.length} bài chờ nộp · ${submitted.length} bài đã nộp`}
                aside={
                    <div className="flex gap-3">
                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-3 text-center min-w-[100px]">
                            <p className="text-[11px] uppercase tracking-wider text-amber-400/80 font-semibold">
                                Chờ nộp
                            </p>
                            <p className="text-2xl font-bold text-amber-400 mt-0.5">
                                {pending.length}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-center min-w-[100px]">
                            <p className="text-[11px] uppercase tracking-wider text-emerald-400/80 font-semibold">
                                Đã nộp
                            </p>
                            <p className="text-2xl font-bold text-emerald-400 mt-0.5">
                                {submitted.length}
                            </p>
                        </div>
                    </div>
                }
            />

            {pending.length > 0 && (
                <section>
                    <SectionHeader
                        icon={ClipboardList}
                        title="Cần hoàn thành"
                    />
                    <AssignmentsPanel assignments={pending} />
                </section>
            )}

            {submitted.length > 0 && (
                <section>
                    <SectionHeader icon={ClipboardList} title="Đã nộp" />
                    <AssignmentsPanel assignments={submitted} />
                </section>
            )}
        </div>
    );
}
