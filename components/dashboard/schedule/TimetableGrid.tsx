"use client";

import { MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TeachingScheduleItem } from "@/lib/teaching-schedule";
import {
  getSlotsForCell,
  getTimetableTimeRows,
  WEEK_DAYS,
} from "@/lib/timetable";

type TimetableGridProps = {
  schedule: TeachingScheduleItem[];
  editable?: boolean;
  onDelete?: (id: number) => void;
};

const DAY_HEADER_COLORS: Record<string, string> = {
  T2: "text-blue-300",
  T3: "text-violet-300",
  T4: "text-emerald-300",
  T5: "text-amber-300",
  T6: "text-rose-300",
  T7: "text-cyan-300",
  CN: "text-slate-300",
};

export default function TimetableGrid({
  schedule,
  editable = false,
  onDelete,
}: TimetableGridProps) {
  const timeRows = getTimetableTimeRows(schedule);
  const hasAnySlot = schedule.length > 0;

  if (!hasAnySlot) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
        <p className="text-white font-medium">Chưa có tiết học nào</p>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          {editable
            ? "Thêm tiết học bằng form bên trên để hiển thị trên bảng thời khoá biểu."
            : "Giáo viên chưa cập nhật lịch học. Vui lòng quay lại sau."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/[0.03]">
              <th className="sticky left-0 z-20 w-24 min-w-24 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 bg-[#0a0914] border-r border-white/8">
                Giờ
              </th>
              {WEEK_DAYS.map((day) => (
                <th
                  key={day}
                  className={`px-2 py-3 text-center text-xs font-bold uppercase tracking-wider ${DAY_HEADER_COLORS[day] ?? "text-slate-300"}`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeRows.map((time, rowIndex) => (
              <tr
                key={time}
                className={rowIndex % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"}
              >
                <td className="sticky left-0 z-10 px-3 py-2 font-mono text-xs font-semibold text-indigo-300 bg-[#0a0914] border-r border-white/8 border-b border-white/[0.06] whitespace-nowrap">
                  {time}
                </td>
                {WEEK_DAYS.map((day) => {
                  const slots = getSlotsForCell(schedule, day, time);
                  return (
                    <td
                      key={`${day}-${time}`}
                      className="align-top p-1.5 border-b border-white/[0.06] border-r border-white/[0.04] last:border-r-0 min-w-[100px]"
                    >
                      {slots.length === 0 ? (
                        <span className="block h-full min-h-[52px] rounded-lg bg-white/[0.01]" />
                      ) : (
                        <div className="space-y-1.5 min-h-[52px]">
                          {slots.map((slot) => (
                            <div
                              key={slot.id}
                              className="group relative rounded-lg border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 px-2 py-2 hover:border-indigo-400/35 transition-colors"
                            >
                              <p className="text-xs font-semibold text-white leading-snug line-clamp-2">
                                {slot.lessonTitle}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                {slot.className}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-0.5 truncate">
                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                {slot.room}
                              </p>
                              {editable && onDelete && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onDelete(slot.id)}
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-300 hover:bg-rose-500/15 transition-opacity"
                                  aria-label="Xóa tiết học"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
