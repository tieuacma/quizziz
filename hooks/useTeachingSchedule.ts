"use client";

import { useCallback, useSyncExternalStore, type SetStateAction } from "react";
import {
  getTeachingScheduleServerSnapshot,
  getTeachingScheduleSnapshot,
  persistTeachingSchedule,
  subscribeTeachingSchedule,
  type TeachingScheduleItem,
} from "@/lib/teaching-schedule";

export function useTeachingSchedule() {
  const schedule = useSyncExternalStore(
    subscribeTeachingSchedule,
    getTeachingScheduleSnapshot,
    getTeachingScheduleServerSnapshot,
  );

  const setSchedule = useCallback((updater: SetStateAction<TeachingScheduleItem[]>) => {
    const current = getTeachingScheduleSnapshot();
    const next = typeof updater === "function" ? updater(current) : updater;
    persistTeachingSchedule(next);
  }, []);

  return [schedule, setSchedule] as const;
}
