import {
    TeachingScheduleItem,
    WEEK_DAYS,
    WeekDay,
    sortTeachingSchedule,
} from "@/lib/teaching-schedule";

const DEFAULT_TIME_SLOTS = ["07:30", "09:30", "13:00", "15:00"];

export function getTimetableTimeRows(
    schedule: TeachingScheduleItem[]
): string[] {
    const times = new Set<string>(DEFAULT_TIME_SLOTS);
    schedule.forEach((item) => times.add(item.time));
    return [...times].sort((a, b) => a.localeCompare(b));
}

export function getSlotsForCell(
    schedule: TeachingScheduleItem[],
    day: WeekDay,
    time: string
): TeachingScheduleItem[] {
    return sortTeachingSchedule(
        schedule.filter((item) => item.day === day && item.time === time)
    );
}

export { WEEK_DAYS };
