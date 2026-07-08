import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { LESSONS } from "@/lib/lessons-data";
import { LESSON_COUNT } from "@/lib/constants";
import { toProgressMap, completedCount, badgeCount, progressPercent, lessonNodeStatus, isCourseComplete } from "@/lib/progress";
import { ProgressBar } from "@/components/ProgressBar";
import { Icon } from "@/components/Icon";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Progress Map · Kingdom Culture Academy" };

export default async function CoursePage() {
  const user = await requireUser();
  const rows = await prisma.lessonProgress.findMany({ where: { userId: user.id } });
  const progress = toProgressMap(rows);
  const complete = isCourseComplete(progress);

  return (
    <div>
      <h1 className={styles.title}>Kingdom Culture Academy</h1>
      <p className={styles.subtitle}>
        {completedCount(progress)} of {LESSON_COUNT} lessons complete · {badgeCount(progress)} badges earned
      </p>

      <div className={styles.progressWrap}>
        <ProgressBar percent={progressPercent(progress)} height={10} />
      </div>

      <div className={styles.panel}>
        {LESSONS.map((lesson) => {
          const status = lessonNodeStatus(progress, lesson.num);
          return (
            <div key={lesson.num} className={styles.row}>
              <div className={styles.railCol}>
                {status === "locked" ? (
                  <div className={`${styles.circle} ${styles.circleLocked}`}>
                    <Icon name="lock" size={18} />
                  </div>
                ) : (
                  <Link
                    href={`/course/${lesson.num}`}
                    className={`${styles.circle} ${status === "complete" ? styles.circleComplete : styles.circleAvailable}`}
                  >
                    {status === "complete" ? <Icon name="check" size={22} /> : lesson.num}
                  </Link>
                )}
                <div className={`${styles.rail} ${status === "locked" ? styles.railLocked : styles.railDone}`} />
              </div>
              <div className={styles.nodeBody}>
                <div className={styles.eyebrow}>Lesson {lesson.num}</div>
                <div className={styles.lessonTitle}>{lesson.title}</div>
                <div className={styles.teaser}>{lesson.teaser}</div>
                {status === "locked" ? (
                  <span className={`${styles.cta} ${styles.ctaLocked}`}>Locked</span>
                ) : (
                  <Link href={`/course/${lesson.num}`} className={`${styles.cta} ${status === "complete" ? styles.ctaComplete : styles.ctaAvailable}`}>
                    {status === "complete" ? "Review Lesson" : "Start Lesson"}
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        <div className={styles.row}>
          <div className={styles.railCol}>
            <Link href="/certificate" className={`${styles.circle} ${complete ? styles.circleComplete : styles.circleAvailable}`}>
              <Icon name="certificate" size={24} />
            </Link>
          </div>
          <div className={styles.nodeBodyLast}>
            <div className={styles.lessonTitle}>Certificate of Completion</div>
            <div className={styles.certDescription}>Awarded once all ten lessons are complete.</div>
            <Link href="/certificate" className={`${styles.cta} ${complete ? styles.ctaComplete : styles.ctaAvailable}`}>
              {complete ? "View Certificate" : "View Progress"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
