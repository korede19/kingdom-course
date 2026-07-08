import type { LessonProgress } from "@prisma/client";
import { LESSON_COUNT } from "@/lib/constants";

export const PASS_THRESHOLD = 8;
export const MAX_ATTEMPTS = 3;
export const COOLDOWN_MS = 90 * 1000;

export type ProgressByLesson = Map<number, LessonProgress>;

export function toProgressMap(rows: LessonProgress[]): ProgressByLesson {
  return new Map(rows.map((row) => [row.lessonNum, row]));
}

export function isLessonUnlocked(progress: ProgressByLesson, lessonNum: number): boolean {
  if (lessonNum <= 1) return true;
  const prev = progress.get(lessonNum - 1);
  return !!prev?.quizPassed;
}

export type LessonNodeStatus = "locked" | "available" | "complete";

export function lessonNodeStatus(progress: ProgressByLesson, lessonNum: number): LessonNodeStatus {
  if (progress.get(lessonNum)?.quizPassed) return "complete";
  if (!isLessonUnlocked(progress, lessonNum)) return "locked";
  return "available";
}

export function completedCount(progress: ProgressByLesson): number {
  let count = 0;
  for (const row of progress.values()) if (row.quizPassed) count++;
  return count;
}

export function badgeCount(progress: ProgressByLesson): number {
  let count = 0;
  for (const row of progress.values()) if (row.badgeEarned) count++;
  return count;
}

export function progressPercent(progress: ProgressByLesson): number {
  return Math.round((completedCount(progress) / LESSON_COUNT) * 100);
}

export function isCourseComplete(progress: ProgressByLesson): boolean {
  return completedCount(progress) >= LESSON_COUNT;
}

export function cooldownSecondsRemaining(cooldownUntil: Date | null): number {
  if (!cooldownUntil) return 0;
  const remainingMs = cooldownUntil.getTime() - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
}
