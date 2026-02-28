// app/components/quiz/QuizPlayer.helpers.ts
import { BASE_POINTS, DEFAULT_TIME_PER_QUESTION } from "./QuizPlayer.constants";

// Client-side point calculation (for optimistic UI)
export function calculatePointsOptimistic(
    timeRemaining: number,
    totalTime: number,
    streak: number
): number {
    const timeRatio = Math.max(0, timeRemaining / totalTime);
    const basePoints = Math.round(BASE_POINTS * timeRatio);

    // Match engine logic exactly
    const streakBonus = Math.min(900, Math.floor(streak / 3) * 300);

    return basePoints + (streak >= 3 ? streakBonus : 0);
}

export function normalizeAnswer(a: unknown): string {
    if (!a || typeof a !== 'string') return "";
    return a.trim().toLowerCase();
}

// Calculate score for engine (uses engine's time remaining)
export function calculatePoints(
    timeRemaining: number,
    streak: number
): number {
    return calculatePointsOptimistic(timeRemaining, DEFAULT_TIME_PER_QUESTION, streak);
}
