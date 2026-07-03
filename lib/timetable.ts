import {
    TeachingScheduleItem,
    WEEK_DAYS,
    WeekDay,
    sortTeachingSchedule,
} from "@/lib/teaching-schedule";

// Khung giờ mặc định cố định hiển thị trên các hàng (Rows) của thời khóa biểu
const DEFAULT_TIME_SLOTS = ["07:30", "09:30", "13:00", "15:00"];

/**
 * CHỨC NĂNG: Thu thập tất cả các mốc giờ (gồm giờ mặc định + giờ tự thêm từ lịch dạy) và xếp tăng dần để làm danh sách hàng (Rows).
 */
export function getTimetableTimeRows(
    schedule: TeachingScheduleItem[]
): string[] {
    // Dùng cấu trúc Set để tự động loại bỏ trùng lặp mốc thời gian
    const times = new Set<string>(DEFAULT_TIME_SLOTS);
    schedule.forEach((item) => times.add(item.time)); // Duyệt lịch dạy, nhặt thêm giờ tùy biến vào Set

    // Convert ngược Set về mảng và sắp xếp tăng dần theo thời gian (07:30 -> 09:30 -> 13:00)
    return [...times].sort((a, b) => a.localeCompare(b));
}

/**
 * CHỨC NĂNG: Lọc và trả về danh sách lịch dạy khớp chính xác với tọa độ ô [Thứ, Giờ] trên giao diện Ma trận lịch.
 */
export function getSlotsForCell(
    schedule: TeachingScheduleItem[],
    day: WeekDay,
    time: string
): TeachingScheduleItem[] {
    return sortTeachingSchedule(
        // Lọc các item trùng khớp cả Thứ (day) lẫn Khung giờ (time) rồi chạy sort lại cho chuẩn vị trí
        schedule.filter((item) => item.day === day && item.time === time)
    );
}

export { WEEK_DAYS };