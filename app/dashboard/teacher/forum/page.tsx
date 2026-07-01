import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import ModerationQueue from "@/components/forum/ModerationQueue";

export default async function TeacherForumPage() {
    const session = await getSession();
    if (!session) redirect("/login");
    if (session.role !== "teacher" && session.role !== "admin")
        redirect("/dashboard");

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div>
                <div className="text-white text-2xl font-bold flex items-center gap-2">
                    <span>🛡️</span>
                    <span>Bảng điều khiển kiểm duyệt diễn đàn</span>
                </div>
                <p className="text-slate-400 text-sm mt-1">
                    Khu vực phê duyệt các câu hỏi mới, thảo luận đang chờ duyệt
                    hoặc xử lý các báo cáo vi phạm từ cộng đồng học sinh.
                </p>
            </div>

            <div className="border border-white/8 bg-white/[0.01] rounded-2xl p-5 sm:p-6 shadow-xl">
                <h3 className="text-white text-sm font-bold flex items-center gap-2 mb-4 pb-2 border-b border-white/6">
                    <span>📋</span>
                    <span>Hàng đợi kiểm duyệt (Moderation Queue)</span>
                </h3>

                <ModerationQueue />
            </div>
        </div>
    );
}
