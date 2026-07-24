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

  const certNumber = `KCA-${user.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.certificateOuter}>
        <div className={styles.certificate}>
          <span className={styles.cornerTL} aria-hidden="true" />
          <span className={styles.cornerTR} aria-hidden="true" />
          <span className={styles.cornerBL} aria-hidden="true" />
          <span className={styles.cornerBR} aria-hidden="true" />

          <div className={styles.certificateInner}>
            <div className={styles.watermark} aria-hidden="true">
              <svg viewBox="0 0 200 200" fill="none" stroke="currentColor">
                <circle cx="100" cy="100" r="94" strokeWidth="1.2" />
                <circle cx="100" cy="100" r="80" strokeWidth="1" strokeDasharray="1 7" />
                <circle cx="100" cy="100" r="64" strokeWidth="1.2" />
                {Array.from({ length: 24 }).map((_, i) => {
                  const a = (i * 15 * Math.PI) / 180;
                  const x1 = 100 + 64 * Math.cos(a);
                  const y1 = 100 + 64 * Math.sin(a);
                  const x2 = 100 + 80 * Math.cos(a);
                  const y2 = 100 + 80 * Math.sin(a);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1" />;
                })}
                <path
                  d="M100 34 L110 92 L100 100 L90 92 Z M100 166 L90 108 L100 100 L110 108 Z M34 100 L92 90 L100 100 L92 110 Z M166 100 L108 110 L100 100 L108 90 Z"
                  fill="currentColor"
                  stroke="none"
                />
                <circle cx="100" cy="100" r="14" strokeWidth="1.4" />
                <circle cx="100" cy="100" r="3" fill="currentColor" stroke="none" />
              </svg>
            </div>

            <div className={styles.content}>
              <div className={styles.crest}>
                <Icon name="shield" size={26} color="var(--color-orange)" />
              </div>
              <div className={styles.brand}>Kingdom Culture Academy</div>

              <h1 className={styles.title}>Certificate of Completion</h1>
              <div className={styles.rule}>
                <span />
                <Icon name="star" size={12} color="var(--color-gold-deep)" />
                <span />
              </div>

              <div className={styles.certifiesText}>This certifies that</div>
              <div className={styles.name}>{user.name}</div>
              <p className={styles.body}>
                has completed the full {LESSON_COUNT}-lesson journey into the Culture of Heaven on Earth, and is
                recognized as a formed citizen and ambassador of the Kingdom of Heaven.
              </p>

              <div className={styles.footer}>
                <div className={styles.footerCol}>
                  <div className={styles.footerValue}>{formatDate(user.completionDate)}</div>
                  <div className={styles.footerLine} />
                  <div className={styles.footerLabel}>Date Completed</div>
                </div>

                <div className={styles.medallion}>
                  <div className={styles.medallionRing}>
                    <Icon name="certificate" size={22} color="var(--color-gold-deep)" />
                  </div>
                  <div className={styles.medallionText}>
                    {badgeCount(progress)}/{LESSON_COUNT} Badges
                  </div>
                </div>

                <div className={styles.footerCol}>
                  <div className={`${styles.footerValue} ${styles.signature}`}>Kingdom Culture Academy</div>
                  <div className={styles.footerLine} />
                  <div className={styles.footerLabel}>Issuing Authority</div>
                </div>
              </div>

              <div className={styles.certNumber}>Certificate No. {certNumber}</div>
            </div>
          </div>
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
