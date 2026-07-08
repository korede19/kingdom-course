import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { toProgressMap, completedCount, badgeCount, isCourseComplete } from "@/lib/progress";
import { LESSON_COUNT } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { PrintButton } from "@/components/PrintButton";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Certificate · Kingdom Culture Academy" };

export default async function CertificatePage() {
  const user = await requireUser();
  const rows = await prisma.lessonProgress.findMany({ where: { userId: user.id } });
  const progress = toProgressMap(rows);
  const complete = isCourseComplete(progress);

  if (!complete || !user.completionDate) {
    const lessonsLeft = LESSON_COUNT - completedCount(progress);
    return (
      <div className={styles.wrap}>
        <div className={styles.lockedPanel}>
          <div className={styles.lockedIcon}>
            <Icon name="lock" size={26} color="#A85F1E" />
          </div>
          <h2 className={styles.lockedTitle}>Your certificate is still locked</h2>
          <p className={styles.lockedText}>
            Complete all {LESSON_COUNT} lessons to unlock your Certificate of Completion. You have {lessonsLeft}{" "}
            lesson{lessonsLeft === 1 ? "" : "s"} left to go.
          </p>
          <Link href="/course" className={styles.lockedButton}>
            Go to Progress Map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.certificate}>
        <div className={styles.certificateInner} />
        <div className={styles.crest}>
          <Icon name="shield" size={30} color="#D2823C" />
        </div>
        <div className={styles.brand}>Kingdom Culture Academy</div>
        <div className={styles.certifiesText}>This certifies that</div>
        <div className={styles.name}>{user.name}</div>
        <div className={styles.body}>
          has completed the full {LESSON_COUNT}-lesson journey into the Culture of Heaven on Earth, and is
          recognized as a formed citizen and ambassador of the Kingdom of Heaven.
        </div>
        <div className={styles.date}>{formatDate(user.completionDate)}</div>
        <div className={styles.badgeCount}>
          {badgeCount(progress)} of {LESSON_COUNT} Badges Earned
        </div>
      </div>
      <div className={styles.actions}>
        <Link href="/course" className={styles.backButton}>
          Back to Progress Map
        </Link>
        <PrintButton className={styles.printButton} />
      </div>
    </div>
  );
}
