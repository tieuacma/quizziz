"use client";

import { CalendarDays } from "lucide-react";
import ScheduleSlotForm from "@/components/dashboard/schedule/ScheduleSlotForm";
import TimetableGrid from "@/components/dashboard/schedule/TimetableGrid";
import { useTeachingSchedule } from "@/hooks/useTeachingSchedule";

export default function TeacherScheduleWorkspace() {
  const [schedule, setSchedule] = useTeachingSchedule();

  const onDelete = (id: number) => {
    setSchedule((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <ScheduleSlotForm schedule={schedule} onAdd={setSchedule} />

      <section>
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Bảng thời khoá biểu</h2>
          <span className="text-xs text-slate-500 ml-auto">
            Di chuột vào ô tiết để xóa
          </span>
        </div>
        <TimetableGrid schedule={schedule} editable onDelete={onDelete} />
      </section>
    </div>
  );
}
