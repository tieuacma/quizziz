import DashboardCard from "@/components/dashboard/DashboardCard";
import { ASSIGNMENTS } from "@/app/dashboard/student/data";

type Assignment = (typeof ASSIGNMENTS)[number];

export default function AssignmentsPanel({
    assignments,
}: {
    assignments: readonly Assignment[];
}) {
    return (
        <DashboardCard className="overflow-hidden h-full">
            {assignments.map((a, i) => (
                <div
                    key={a.id}
                    className={`flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/5 transition-colors ${
                        i !== 0 ? "border-t border-white/8" : ""
                    }`}
                >
                    <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                            {a.title}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                            {a.course}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-slate-400 text-xs hidden sm:inline whitespace-nowrap">
                            {a.due}
                        </span>
                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                a.status === "submitted"
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : "bg-amber-500/15 text-amber-400"
                            }`}
                        >
                            {a.status === "submitted" ? "Đã nộp" : "Chờ nộp"}
                        </span>
                    </div>
                </div>
            ))}
        </DashboardCard>
    );
}
