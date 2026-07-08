import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getLesson } from "@/lib/lessons-data";
import { LESSON_COUNT } from "@/lib/constants";
import { toProgressMap, isLessonUnlocked } from "@/lib/progress";
import { ReflectionForm } from "./ReflectionForm";

type Params = { lessonNum: string };

export const metadata: Metadata = { title: "Reflect · Kingdom Culture Academy" };

export default async function ReflectionPage({ params }: { params: Promise<Params> }) {
  const { lessonNum: lessonNumParam } = await params;
  const lessonNum = Number(lessonNumParam);
  if (!Number.isInteger(lessonNum) || lessonNum < 1 || lessonNum > LESSON_COUNT) notFound();

  const lesson = getLesson(lessonNum);
  if (!lesson) notFound();

  const user = await requireUser();
  const rows = await prisma.lessonProgress.findMany({ where: { userId: user.id } });
  const progress = toProgressMap(rows);
  if (!isLessonUnlocked(progress, lessonNum)) redirect("/course");

  const existing = progress.get(lessonNum);
  const savedReflection = Array.isArray(existing?.reflection) ? (existing.reflection as string[]) : [];

  return (
    <ReflectionForm
      lessonNum={lessonNum}
      questions={lesson.reflectionQs}
      savedAnswers={savedReflection}
    />
  );
}
