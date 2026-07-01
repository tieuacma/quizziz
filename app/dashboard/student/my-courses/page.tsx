import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";
import CourseCard from "@/components/dashboard/student/CourseCard";
import StudentSubpageHeader from "@/components/dashboard/student/StudentSubpageHeader";
import { COURSES } from "@/app/dashboard/student/data";

export default async function CoursesPage() {
    const session = await getSession();
    if (!session || session.role !== "student") redirect("/dashboard");

    const avgProgress = Math.round(
        COURSES.reduce((sum, c) => sum + c.progress, 0) / COURSES.length
    );

    return (
        <div className="mx-auto w-full max-w-6xl space-y-8">
            <StudentSubpageHeader
                title="My Courses"
                description={`${COURSES.length} môn đang học · Tiến độ trung bình ${avgProgress}%`}
                aside={
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-3 text-center sm:text-right">
                        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                            Tổng tín chỉ
                        </p>
                        <p className="text-2xl font-bold text-violet-400 mt-0.5">
                            {COURSES.reduce((sum, c) => sum + c.credits, 0)}
                        </p>
                    </div>
                }
            />

            <section>
                <SectionHeader icon={BookOpen} title="Danh sách môn học" />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {COURSES.map((c) => (
                        <CourseCard key={c.id} course={c} />
                    ))}
                </div>
            </section>
        </div>
    );
}
