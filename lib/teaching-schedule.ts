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

const dayToIndex = (day: WeekDay) => WEEK_DAYS.indexOf(day);

export function sortTeachingSchedule(items: TeachingScheduleItem[]) {
  return [...items].sort((a, b) => {
    const dayDiff = dayToIndex(a.day) - dayToIndex(b.day);
    if (dayDiff !== 0) return dayDiff;
    return a.time.localeCompare(b.time);
  });
}

const SCHEDULE_CHANGE_EVENT = "zenith:teaching-schedule-updated";

/** Stable snapshot for useSyncExternalStore — must not allocate on every getSnapshot call. */
let cachedRaw: string | null | undefined;
let cachedSnapshot: TeachingScheduleItem[] = DEFAULT_TEACHING_SCHEDULE;

function readTeachingScheduleFromStorage(): TeachingScheduleItem[] {
  if (typeof window === "undefined") return DEFAULT_TEACHING_SCHEDULE;

  const raw = window.localStorage.getItem(TEACHING_SCHEDULE_STORAGE_KEY);
  if (raw === cachedRaw) return cachedSnapshot;

  cachedRaw = raw;

  if (!raw) {
    cachedSnapshot = DEFAULT_TEACHING_SCHEDULE;
    return cachedSnapshot;
  }

  try {
    const parsed = JSON.parse(raw) as TeachingScheduleItem[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      cachedSnapshot = sortTeachingSchedule(parsed);
      return cachedSnapshot;
    }
  } catch {
    window.localStorage.removeItem(TEACHING_SCHEDULE_STORAGE_KEY);
    cachedRaw = null;
  }

  cachedSnapshot = DEFAULT_TEACHING_SCHEDULE;
  return cachedSnapshot;
}

export function subscribeTeachingSchedule(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(SCHEDULE_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(SCHEDULE_CHANGE_EVENT, handler);
  };
}

export function getTeachingScheduleSnapshot(): TeachingScheduleItem[] {
  return readTeachingScheduleFromStorage();
}

export function getTeachingScheduleServerSnapshot(): TeachingScheduleItem[] {
  return DEFAULT_TEACHING_SCHEDULE;
}

export function persistTeachingSchedule(schedule: TeachingScheduleItem[]) {
  const sorted = sortTeachingSchedule(schedule);
  const raw = JSON.stringify(sorted);
  window.localStorage.setItem(TEACHING_SCHEDULE_STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedSnapshot = sorted;
  window.dispatchEvent(new Event(SCHEDULE_CHANGE_EVENT));
}
