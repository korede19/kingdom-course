import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getLesson, toPublicLesson } from "@/lib/lessons-data";
import { LESSON_COUNT } from "@/lib/constants";
import { toProgressMap, isLessonUnlocked, cooldownSecondsRemaining, MAX_ATTEMPTS } from "@/lib/progress";
import { QuizClient } from "./QuizClient";

type Params = { lessonNum: string };

export const metadata: Metadata = { title: "Quiz · Kingdom Culture Academy" };

export default async function QuizPage({ params }: { params: Promise<Params> }) {
  const { lessonNum: lessonNumParam } = await params;
  const lessonNum = Number(lessonNumParam);
  if (!Number.isInteger(lessonNum) || lessonNum < 1 || lessonNum > LESSON_COUNT) notFound();

  const lesson = getLesson(lessonNum);
  if (!lesson) notFound();

  const user = await requireUser();
  const rows = await prisma.lessonProgress.findMany({ where: { userId: user.id } });
  const progress = toProgressMap(rows);
  if (!isLessonUnlocked(progress, lessonNum)) redirect("/course");

  const thisProgress = progress.get(lessonNum);
  const cooldownSeconds = cooldownSecondsRemaining(thisProgress?.cooldownUntil ?? null);
  const attemptsLeft = cooldownSeconds > 0 ? 0 : MAX_ATTEMPTS - (thisProgress?.attempts ?? 0);

  return (
    <QuizClient
      lessonNum={lessonNum}
      questions={toPublicLesson(lesson).quiz}
      initialCooldownSeconds={cooldownSeconds}
      initialAttemptsLeft={attemptsLeft}
      isFinalLesson={lessonNum === LESSON_COUNT}
    />
  );
}
