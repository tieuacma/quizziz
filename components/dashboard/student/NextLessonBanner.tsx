"use client";

import React, { useState } from "react";

import { motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { SCHEDULE } from "@/app/dashboard/student/data";
import { Button } from "@/components/ui/button";

type ScheduleItem = (typeof SCHEDULE)[number];

const DAY_MAP: Record<string, number> = {
    T2: 1,
    T3: 2,
    T4: 3,
    T5: 4,
    T6: 5,
    T7: 6,
    CN: 0,
};

function getNextLesson(): ScheduleItem {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday...
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeVal = currentHour * 60 + currentMinute;

    // Convert schedule items to weekday offset & time in minutes
    const itemsWithTime = SCHEDULE.map((item) => {
        const targetDayIndex = DAY_MAP[item.day];
        const [hourStr, minStr] = item.time.split(":");
        const targetTimeVal = parseInt(hourStr, 10) * 60 + parseInt(minStr, 10);

        // Calculate days until this item
        let daysDiff = targetDayIndex - currentDay;
        if (
            daysDiff < 0 ||
            (daysDiff === 0 && targetTimeVal <= currentTimeVal)
        ) {
            daysDiff += 7; // Wraps to next week
        }

        const totalMinutesUntil =
            daysDiff * 24 * 60 + (targetTimeVal - currentTimeVal);
        return { item, totalMinutesUntil };
    });

    // Sort by time difference
    itemsWithTime.sort((a, b) => a.totalMinutesUntil - b.totalMinutesUntil);

    return itemsWithTime[0].item;
}

export default function NextLessonBanner() {
    const [nextLesson] = useState<ScheduleItem>(() => getNextLesson());

    if (!nextLesson) return null;

    const dayLabel =
        (nextLesson.day as string) === "CN"
            ? "Chủ Nhật"
            : `Thứ ${nextLesson.day.replace("T", "")}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative rounded-2xl overflow-hidden border border-violet-500/25 bg-gradient-to-r from-violet-600/10 via-purple-600/5 to-transparent p-5 md:p-6 mb-6 group shadow-lg shadow-purple-950/20"
        >
            {/* Glow Backlight */}
            <div className="absolute top-0 right-10 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[60px] pointer-events-none transition-transform duration-500 group-hover:scale-125" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                        <CalendarDays className="w-6 h-6 animate-pulse text-white" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                                Lớp Học Tiếp Theo
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                                {dayLabel} lúc {nextLesson.time}
                            </span>
                        </div>
                        <h3 className="text-white dark:text-white font-bold text-base md:text-lg mt-1 tracking-tight">
                            {nextLesson.course} —{" "}
                            <span className="text-violet-300 dark:text-violet-300">
                                {nextLesson.lesson}
                            </span>
                        </h3>
                        <p className="text-slate-400 dark:text-slate-400 text-xs mt-0.5">
                            Hãy chuẩn bị bài đọc trước khi lớp học bắt đầu.
                        </p>
                    </div>
                </div>

                <div className="flex items-center">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 text-xs font-bold px-5 py-5 rounded-xl flex items-center gap-2 group cursor-pointer transition-all duration-300 hover:translate-x-1">
                        Vào lớp học
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
