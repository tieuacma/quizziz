import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";
import LearningResultsPanel from "@/components/dashboard/student/LearningResultsPanel";
import StudentSubpageHeader from "@/components/dashboard/student/StudentSubpageHeader";
import { LEARNING_RESULTS } from "@/app/dashboard/student/data";

function gpaFromResults() {
    const avg =
        LEARNING_RESULTS.reduce((sum, r) => sum + r.currentAvg, 0) /
        Math.max(LEARNING_RESULTS.length, 1);
    return avg.toFixed(1);
}

export default async function LearningResultsPage() {
    const session = await getSession();
    if (!session || session.role !== "student") redirect("/dashboard");

    const onTrack = LEARNING_RESULTS.filter(
        (r) => r.currentAvg >= r.targetAvg
    ).length;
    const gpa = gpaFromResults();

    return (
        <div className="mx-auto w-full max-w-6xl space-y-8">
            <StudentSubpageHeader
                title="Learning Results"
                description={`${onTrack}/${LEARNING_RESULTS.length} môn đạt mục tiêu điểm`}
                aside={
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-center sm:text-right min-w-[120px]">
                        <p className="text-[11px] uppercase tracking-wider text-emerald-400/80 font-semibold">
                            Điểm TB
                        </p>
                        <p className="text-2xl font-bold text-emerald-400 mt-0.5">
                            {gpa}
                        </p>
                    </div>
                }
            />

            <section>
                <SectionHeader icon={GraduationCap} title="Chi tiết theo môn" />
                <div className="max-w-xl">
                    <LearningResultsPanel results={LEARNING_RESULTS} />
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
                {LEARNING_RESULTS.map((r) => {
                    const onTarget = r.currentAvg >= r.targetAvg;
                    return (
                        <div
                            key={r.id}
                            className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition-colors"
                        >
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <h3 className="text-white font-semibold">
                                    {r.course}
                                </h3>
                                <span
                                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                        onTarget
                                            ? "bg-emerald-500/15 text-emerald-400"
                                            : "bg-amber-500/15 text-amber-400"
                                    }`}
                                >
                                    {onTarget
                                        ? "Đạt mục tiêu"
                                        : "Cần cải thiện"}
                                </span>
                            </div>
                            <div className="flex gap-6 text-sm">
                                <div>
                                    <p className="text-slate-500 text-xs">
                                        Hiện tại
                                    </p>
                                    <p className="text-white font-bold text-lg">
                                        {r.currentAvg}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs">
                                        Mục tiêu
                                    </p>
                                    <p className="text-slate-300 font-bold text-lg">
                                        {r.targetAvg}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs">
                                        Tiến độ
                                    </p>
                                    <p className="text-violet-400 font-bold text-lg">
                                        {r.progress}%
                                    </p>
                                </div>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-4">
                                <div
                                    className={`h-full rounded-full ${
                                        onTarget
                                            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                            : "bg-gradient-to-r from-amber-500 to-orange-500"
                                    }`}
                                    style={{ width: `${r.progress}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}
