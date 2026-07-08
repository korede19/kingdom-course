"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getLesson, correctIndex } from "@/lib/lessons-data";
import { LESSON_COUNT } from "@/lib/constants";
import { MAX_ATTEMPTS, COOLDOWN_MS, PASS_THRESHOLD, cooldownSecondsRemaining } from "@/lib/progress";

function assertValidLessonNum(lessonNum: number): void {
  if (!Number.isInteger(lessonNum) || lessonNum < 1 || lessonNum > LESSON_COUNT) {
    throw new Error("Invalid lesson number.");
  }
}

export async function markLessonReadAction(lessonNum: number): Promise<void> {
  assertValidLessonNum(lessonNum);
  const user = await requireUser();

  await prisma.lessonProgress.upsert({
    where: { userId_lessonNum: { userId: user.id, lessonNum } },
    update: { read: true },
    create: { userId: user.id, lessonNum, read: true },
  });

  revalidatePath(`/course/${lessonNum}`);
}

export async function saveReflectionAction(lessonNum: number, answers: string[]): Promise<void> {
  assertValidLessonNum(lessonNum);
  const user = await requireUser();
  const safeAnswers = answers.slice(0, 10).map((a) => String(a).slice(0, 4000));

  await prisma.lessonProgress.upsert({
    where: { userId_lessonNum: { userId: user.id, lessonNum } },
    update: { reflection: safeAnswers },
    create: { userId: user.id, lessonNum, reflection: safeAnswers },
  });

  revalidatePath(`/course/${lessonNum}`);
}

const submitQuizSchema = z.object({
  lessonNum: z.number().int().min(1).max(LESSON_COUNT),
  answers: z.array(z.number().int().min(0).max(3).nullable()).min(1),
});

export type QuizReviewItem = {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  wasCorrect: boolean;
  explanation: string;
};

export type QuizSubmitResult =
  | { ok: false; error: string; cooldownSeconds: number }
  | {
      ok: true;
      score: number;
      total: number;
      pass: boolean;
      badgeAwarded: boolean;
      courseComplete: boolean;
      review: QuizReviewItem[];
      attemptsLeft: number;
      cooldownSeconds: number;
    };

export async function submitQuizAction(
  lessonNum: number,
  answers: (number | null)[],
): Promise<QuizSubmitResult> {
  const parsed = submitQuizSchema.safeParse({ lessonNum, answers });
  if (!parsed.success) {
    return { ok: false, error: "Invalid quiz submission.", cooldownSeconds: 0 };
  }

  const user = await requireUser();
  const lesson = getLesson(parsed.data.lessonNum);
  if (!lesson) {
    return { ok: false, error: "Lesson not found.", cooldownSeconds: 0 };
  }

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonNum: { userId: user.id, lessonNum: parsed.data.lessonNum } },
  });

  const activeCooldown = cooldownSecondsRemaining(existing?.cooldownUntil ?? null);
  if (activeCooldown > 0) {
    return { ok: false, error: "The quiz is on cooldown. Reread the lesson and try again shortly.", cooldownSeconds: activeCooldown };
  }

  const submittedAnswers = parsed.data.answers;
  let score = 0;
  const review: QuizReviewItem[] = lesson.quiz.map((question, i) => {
    const correctIdx = correctIndex(question);
    const yourIdx = submittedAnswers[i] ?? null;
    const wasCorrect = yourIdx === correctIdx;
    if (wasCorrect) score++;
    return {
      question: question.q,
      yourAnswer: yourIdx === null ? "No answer" : question.options[yourIdx],
      correctAnswer: question.options[correctIdx],
      wasCorrect,
      explanation: question.explanation,
    };
  });

  const pass = score >= PASS_THRESHOLD;
  const prevAttempts = existing?.attempts ?? 0;
  const nextAttempts = pass ? prevAttempts : prevAttempts + 1;
  const shouldCooldown = !pass && nextAttempts >= MAX_ATTEMPTS;

  const updated = await prisma.lessonProgress.upsert({
    where: { userId_lessonNum: { userId: user.id, lessonNum: parsed.data.lessonNum } },
    update: {
      attempts: shouldCooldown ? 0 : nextAttempts,
      cooldownUntil: pass ? null : shouldCooldown ? new Date(Date.now() + COOLDOWN_MS) : null,
      quizPassed: pass || (existing?.quizPassed ?? false),
      bestScore: Math.max(existing?.bestScore ?? 0, score),
      badgeEarned: pass || (existing?.badgeEarned ?? false),
    },
    create: {
      userId: user.id,
      lessonNum: parsed.data.lessonNum,
      attempts: shouldCooldown ? 0 : nextAttempts,
      cooldownUntil: shouldCooldown ? new Date(Date.now() + COOLDOWN_MS) : null,
      quizPassed: pass,
      bestScore: score,
      badgeEarned: pass,
    },
  });

  let courseComplete = false;
  if (pass) {
    const allProgress = await prisma.lessonProgress.findMany({ where: { userId: user.id } });
    courseComplete = allProgress.filter((p) => p.quizPassed).length >= LESSON_COUNT;
    if (courseComplete) {
      const user2 = await prisma.user.findUnique({ where: { id: user.id } });
      if (!user2?.completionDate) {
        await prisma.user.update({ where: { id: user.id }, data: { completionDate: new Date() } });
      }
    }
  }

  revalidatePath(`/course`);
  revalidatePath(`/course/${parsed.data.lessonNum}`);
  revalidatePath(`/certificate`);

  return {
    ok: true,
    score,
    total: lesson.quiz.length,
    pass,
    badgeAwarded: updated.badgeEarned,
    courseComplete,
    review,
    attemptsLeft: pass ? MAX_ATTEMPTS : Math.max(0, MAX_ATTEMPTS - updated.attempts),
    cooldownSeconds: cooldownSecondsRemaining(updated.cooldownUntil),
  };
}
