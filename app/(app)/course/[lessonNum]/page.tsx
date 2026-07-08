import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getLesson } from "@/lib/lessons-data";
import { LESSON_COUNT } from "@/lib/constants";
import { toProgressMap, isLessonUnlocked } from "@/lib/progress";
import { markLessonReadAction } from "@/actions/progress";
import { ContentBlocks } from "@/components/ContentBlocks";
import { Icon } from "@/components/Icon";
import styles from "./page.module.css";

type Params = { lessonNum: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lessonNum } = await params;
  const lesson = getLesson(Number(lessonNum));
  return { title: lesson ? `${lesson.title} · Kingdom Culture Academy` : "Lesson · Kingdom Culture Academy" };
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { lessonNum: lessonNumParam } = await params;
  const lessonNum = Number(lessonNumParam);
  if (!Number.isInteger(lessonNum) || lessonNum < 1 || lessonNum > LESSON_COUNT) notFound();

  const lesson = getLesson(lessonNum);
  if (!lesson) notFound();

  const user = await requireUser();
  const rows = await prisma.lessonProgress.findMany({ where: { userId: user.id } });
  const progress = toProgressMap(rows);
  if (!isLessonUnlocked(progress, lessonNum)) redirect("/course");

  async function continueToReflection() {
    "use server";
    await markLessonReadAction(lessonNum);
    redirect(`/course/${lessonNum}/reflection`);
  }

  return (
    <div>
      <Link href="/course" className={styles.backLink}>
        <Icon name="chevronLeft" size={16} /> Back to Progress Map
      </Link>

      <div className={styles.badgeRow}>
        <span className={styles.lessonBadge}>
          Lesson {lesson.num} of {LESSON_COUNT}
        </span>
        <span className={styles.earnBadge}>Earn: {lesson.badge}</span>
      </div>

      <h1 className={styles.title}>{lesson.title}</h1>

      <div className={styles.panel}>
        <div className={styles.wordBefore}>
          <div className={styles.wordBeforeHeading}>A Word Before You Begin</div>
          <ContentBlocks blocks={lesson.wordBefore} />
        </div>

        <div className={styles.objectivesSection}>
          <div className={styles.objectivesHeading}>By the end of this lesson you will be able to:</div>
          {lesson.objectives.map((objective, i) => (
            <div key={i} className={styles.objectiveRow}>
              <span className={styles.objectiveIcon}>
                <Icon name="check" size={17} color="#D2823C" />
              </span>
              <span className={styles.objectiveText}>{objective}</span>
            </div>
          ))}
        </div>

        {lesson.parts.map((part, i) => (
          <div key={i} className={styles.part}>
            <h2 className={styles.partHeading}>{part.heading}</h2>
            <ContentBlocks blocks={part.content} />
          </div>
        ))}

        <form action={continueToReflection}>
          <button type="submit" className={styles.continueButton}>
            Continue to Reflection →
          </button>
        </form>
      </div>
    </div>
  );
}
