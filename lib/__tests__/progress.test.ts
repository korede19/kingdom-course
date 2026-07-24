import { describe, it, expect } from "vitest";
import {
  toProgressMap,
  isLessonUnlocked,
  lessonNodeStatus,
  completedCount,
  isCourseComplete,
  cooldownSecondsRemaining,
} from "@/lib/progress";
import type { LessonProgress } from "@prisma/client";

function row(overrides: Partial<LessonProgress> & { lessonNum: number }): LessonProgress {
  return {
    id: `row-${overrides.lessonNum}`,
    userId: "user-1",
    read: false,
    quizPassed: false,
    bestScore: 0,
    attempts: 0,
    cooldownUntil: null,
    badgeEarned: false,
    reflection: null,
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("isLessonUnlocked", () => {
  it("lesson 1 is always unlocked", () => {
    const progress = toProgressMap([]);
    expect(isLessonUnlocked(progress, 1)).toBe(true);
  });

  it("lesson 2 is locked until lesson 1's quiz is passed", () => {
    const progress = toProgressMap([row({ lessonNum: 1, quizPassed: false })]);
    expect(isLessonUnlocked(progress, 2)).toBe(false);
  });

  it("lesson 2 unlocks once lesson 1's quiz is passed", () => {
    const progress = toProgressMap([row({ lessonNum: 1, quizPassed: true })]);
    expect(isLessonUnlocked(progress, 2)).toBe(true);
  });
});

describe("lessonNodeStatus", () => {
  it("is 'complete' when the quiz was passed, even if the previous lesson wasn't", () => {
    const progress = toProgressMap([row({ lessonNum: 3, quizPassed: true })]);
    expect(lessonNodeStatus(progress, 3)).toBe("complete");
  });

  it("is 'locked' when the previous lesson hasn't been passed", () => {
    const progress = toProgressMap([]);
    expect(lessonNodeStatus(progress, 5)).toBe("locked");
  });

  it("is 'available' when unlocked but not yet passed", () => {
    const progress = toProgressMap([row({ lessonNum: 1, quizPassed: true })]);
    expect(lessonNodeStatus(progress, 2)).toBe("available");
  });
});

describe("completedCount / isCourseComplete", () => {
  it("counts only lessons with a passed quiz", () => {
    const progress = toProgressMap([
      row({ lessonNum: 1, quizPassed: true }),
      row({ lessonNum: 2, quizPassed: false }),
      row({ lessonNum: 3, quizPassed: true }),
    ]);
    expect(completedCount(progress)).toBe(2);
    expect(isCourseComplete(progress)).toBe(false);
  });

  it("is complete once all 10 lessons are passed", () => {
    const rows = Array.from({ length: 10 }, (_, i) => row({ lessonNum: i + 1, quizPassed: true }));
    const progress = toProgressMap(rows);
    expect(isCourseComplete(progress)).toBe(true);
  });
});

describe("cooldownSecondsRemaining", () => {
  it("is zero when there's no cooldown", () => {
    expect(cooldownSecondsRemaining(null)).toBe(0);
  });

  it("is zero once the cooldown has already passed", () => {
    expect(cooldownSecondsRemaining(new Date(Date.now() - 1000))).toBe(0);
  });

  it("reports remaining seconds while the cooldown is active", () => {
    const remaining = cooldownSecondsRemaining(new Date(Date.now() + 30_000));
    expect(remaining).toBeGreaterThan(0);
    expect(remaining).toBeLessThanOrEqual(30);
  });
});
