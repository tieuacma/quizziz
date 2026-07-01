"use client";

import { CalendarDays } from "lucide-react";
import TimetableGrid from "@/components/dashboard/schedule/TimetableGrid";
import { useTeachingSchedule } from "@/hooks/useTeachingSchedule";

export default function StudentTimetableWorkspace() {
    const [schedule] = useTeachingSchedule();

    return (
        <section>
            <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">
                    Bảng thời khoá biểu tuần
                </h2>
            </div>
            <TimetableGrid schedule={schedule} />
        </section>
    );
}
