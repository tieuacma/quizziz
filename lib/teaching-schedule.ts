export type WeekDay = "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN";

export type TeachingScheduleItem = {
    id: number;
    day: WeekDay;
    time: string;
    className: string;
    lessonTitle: string;
    room: string;
};

export const WEEK_DAYS: WeekDay[] = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export const TEACHING_SCHEDULE_STORAGE_KEY = "zenith:teaching-schedule";

// Data cấu hình mặc định ban đầu cho lịch dạy nếu LocalStorage trống
export const DEFAULT_TEACHING_SCHEDULE: TeachingScheduleItem[] = [
    {
        id: 1,
        day: "T2",
        time: "07:30",
        className: "Lập Trình Web - K22A",
        lessonTitle: "REST API Design",
        room: "P.302",
    },
    {
        id: 2,
        day: "T4",
        time: "07:30",
        className: "Lập Trình Web - K22B",
        lessonTitle: "Authentication & JWT",
        room: "P.305",
    },
    {
        id: 3,
        day: "T6",
        time: "13:00",
        className: "CSDL Nâng Cao - K21",
        lessonTitle: "Query Optimization",
        room: "Lab 2",
    },
];

// Hàm lấy index của ngày trong tuần (T2 -> 0, T3 -> 1,...) phục vụ việc sort
const dayToIndex = (day: WeekDay) => WEEK_DAYS.indexOf(day);

/**
 * CHỨC NĂNG: Sắp xếp lịch dạy tự động (Ưu tiên theo thứ tự thứ trong tuần, trùng thứ thì so sánh mốc thời gian).
 */
export function sortTeachingSchedule(items: TeachingScheduleItem[]) {
    return [...items].sort((a, b) => {
        const dayDiff = dayToIndex(a.day) - dayToIndex(b.day);
        if (dayDiff !== 0) return dayDiff; // Khác ngày -> Sort theo ngày
        return a.time.localeCompare(b.time); // Trùng ngày -> Sort theo giờ (07:30 < 13:00)
    });
}

// Tên Event tùy biến để trigger đồng bộ dữ liệu giữa các component trong app
const SCHEDULE_CHANGE_EVENT = "zenith:teaching-schedule-updated";

/** Caching tránh việc tạo lại vùng nhớ liên tục làm re-render vô hạn khi dùng với useSyncExternalStore */
let cachedRaw: string | null | undefined;
let cachedSnapshot: TeachingScheduleItem[] = DEFAULT_TEACHING_SCHEDULE;

/**
 * CHỨC NĂNG: Đọc dữ liệu lịch dạy từ LocalStorage của trình duyệt và tối ưu cache.
 */
function readTeachingScheduleFromStorage(): TeachingScheduleItem[] {
    if (typeof window === "undefined") return DEFAULT_TEACHING_SCHEDULE; // Check SSR -> dùng data mặc định

    const raw = window.localStorage.getItem(TEACHING_SCHEDULE_STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot; // Trùng chuỗi cũ -> Trả về mảng đã cache chống re-render

    cachedRaw = raw;

    if (!raw) {
        cachedSnapshot = DEFAULT_TEACHING_SCHEDULE;
        return cachedSnapshot;
    }

    try {
        const parsed = JSON.parse(raw) as TeachingScheduleItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
            cachedSnapshot = sortTeachingSchedule(parsed); // Parse thành công -> Sắp xếp rồi mới lưu snapshot
            return cachedSnapshot;
        }
    } catch {
        window.localStorage.removeItem(TEACHING_SCHEDULE_STORAGE_KEY); // JSON lỗi -> dọn dẹp sạch storage
        cachedRaw = null;
    }

    cachedSnapshot = DEFAULT_TEACHING_SCHEDULE;
    return cachedSnapshot;
}

/**
 * CHỨC NĂNG: Đăng ký lắng nghe biến động thay đổi lịch dạy (từ tab khác hoặc event nội bộ) để cập nhật UI.
 */
export function subscribeTeachingSchedule(onStoreChange: () => void) {
    const handler = () => onStoreChange();
    window.addEventListener("storage", handler); // Đồng bộ khi thay đổi từ tab/cửa sổ khác
    window.addEventListener(SCHEDULE_CHANGE_EVENT, handler); // Đồng bộ khi gọi hàm lưu nội bộ
    return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener(SCHEDULE_CHANGE_EVENT, handler);
    };
}

/**
 * CHỨC NĂNG: Lấy snapshot dữ liệu lịch dạy hiện tại chạy ở phía Client.
 */
export function getTeachingScheduleSnapshot(): TeachingScheduleItem[] {
    return readTeachingScheduleFromStorage();
}

/**
 * CHỨC NĂNG: Lấy snapshot dữ liệu mặc định ban đầu chạy ở phía Server (SSR Fallback).
 */
export function getTeachingScheduleServerSnapshot(): TeachingScheduleItem[] {
    return DEFAULT_TEACHING_SCHEDULE;
}

/**
 * CHỨC NĂNG: Lưu đè dữ liệu lịch dạy mới vào LocalStorage và phát event thông báo đồng bộ UI toàn bộ app.
 */
export function persistTeachingSchedule(schedule: TeachingScheduleItem[]) {
    const sorted = sortTeachingSchedule(schedule); // 1. Sắp xếp lại lịch cho chuẩn thứ tự
    const raw = JSON.stringify(sorted);
    window.localStorage.setItem(TEACHING_SCHEDULE_STORAGE_KEY, raw); // 2. Lưu chuỗi JSON vào storage

    // 3. Cập nhật biến cache nội bộ
    cachedRaw = raw;
    cachedSnapshot = sorted;

    // 4. Bắn event thông báo cho các component đang dùng useSyncExternalStore biết để tự động cập nhật lại UI
    window.dispatchEvent(new Event(SCHEDULE_CHANGE_EVENT));
}