"use client";

import { useMemo } from "react";
import { CalendarCheck2, Clock3, MapPin } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { sortTeachingSchedule } from "@/lib/teaching-schedule";
import { useTeachingSchedule } from "@/hooks/useTeachingSchedule";

export default function StudentScheduleCheck() {
  const [schedule] = useTeachingSchedule();

  const nextClasses = useMemo(
    () => sortTeachingSchedule(schedule).slice(0, 3),
    [schedule],
  );

  return (
    <DashboardCard className="h-full p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <CalendarCheck2 className="w-4 h-4 text-indigo-300" />
          Lịch học cần theo dõi
        </h3>
        <span className="text-xs text-slate-400">{schedule.length} buổi/tuần</span>
      </div>
      <ul className="space-y-2">
        {nextClasses.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
          >
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="rounded bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5">{item.day}</span>
              <span className="flex items-center gap-1">
                <Clock3 className="w-3 h-3" /> {item.time}
              </span>
            </div>
            <p className="text-sm font-medium text-white mt-1">{item.lessonTitle}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {item.className} - <MapPin className="inline w-3 h-3 -mt-0.5" /> {item.room}
            </p>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
