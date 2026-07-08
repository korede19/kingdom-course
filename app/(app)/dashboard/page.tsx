import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { toProgressMap, completedCount, badgeCount, progressPercent, isCourseComplete } from "@/lib/progress";
import { LESSON_COUNT } from "@/lib/constants";
import { ProgressBar } from "@/components/ProgressBar";
import { Icon } from "@/components/Icon";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Dashboard · Kingdom Culture Academy" };

const COMING_SOON = [
  {
    icon: "compass" as const,
    title: "Kingdom Prayer & Intercession",
    description: "Learning to pray as a governing citizen, not a beggar.",
    tone: styles.comingSoonAmber,
  },
  {
    icon: "building" as const,
    title: "Marketplace Ministry",
    description: "Carrying kingdom culture into work, business, and industry.",
    tone: styles.comingSoonGreen,
  },
  {
    icon: "heart" as const,
    title: "Family Discipleship",
    description: "Raising children who know their identity from day one.",
    tone: styles.comingSoonPurple,
  },
];

export default async function DashboardPage() {
  const user = await requireUser();
  const rows = await prisma.lessonProgress.findMany({ where: { userId: user.id } });
  const progress = toProgressMap(rows);

  const completed = completedCount(progress);
  const badges = badgeCount(progress);
  const percent = progressPercent(progress);
  const complete = isCourseComplete(progress);
  const nextLessonNum = complete ? LESSON_COUNT : Math.min(LESSON_COUNT, completed + 1);
  const cta = completed === 0 ? "Begin Journey" : complete ? "Review Journey" : "Continue Journey";
  const firstName = user.name.trim().split(/\s+/)[0] ?? user.name;

  return (
    <div>
      <h1 className={styles.greeting}>Welcome back, {firstName}</h1>
      <p className={styles.subtitle}>Pick up your journey, or explore what&rsquo;s ahead.</p>

      <Link href="/course" className={styles.courseCard}>
        <div className={styles.courseCardMain}>
          <div className={styles.eyebrow}>
            Journey Pass · Lesson {nextLessonNum}
          </div>
          <h2 className={styles.courseTitle}>Kingdom Culture Academy</h2>
          <p className={styles.courseDescription}>
            A Journey into the Culture of Heaven on Earth — unlearn the culture of earth, and be formed into a
            citizen and ambassador of the Kingdom.
          </p>
          <div className={styles.progressWrap}>
            <ProgressBar percent={percent} />
          </div>
          <div className={styles.ctaRow}>
            <span className={styles.ctaButton}>{cta}</span>
            <span className={styles.progressLabel}>{completed} of {LESSON_COUNT} lessons complete</span>
          </div>
        </div>

        <div className={styles.statsPanel}>
          <div className={styles.statRow}>
            <div className={styles.statIcon}>
              <Icon name="book" size={15} color="#F2C99B" />
            </div>
            <div>
              <div className={styles.statValue}>
                {completed}
                <span className={styles.statMax}>/{LESSON_COUNT}</span>
              </div>
              <div className={styles.statLabel}>Lessons Done</div>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statRow}>
            <div className={styles.statIcon}>
              <Icon name="certificate" size={15} color="#F2C99B" />
            </div>
            <div>
              <div className={styles.statValue}>
                {badges}
                <span className={styles.statMax}>/{LESSON_COUNT}</span>
              </div>
              <div className={styles.statLabel}>Badges Earned</div>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statRow}>
            <div className={styles.statIcon}>
              <Icon name="star" size={15} color="#F2C99B" />
            </div>
            <div>
              <div className={styles.statValue}>
                {percent}
                <span className={styles.statMax}>%</span>
              </div>
              <div className={styles.statLabel}>Complete</div>
            </div>
          </div>
        </div>
      </Link>

      <h3 className={styles.sectionHeading}>Coming Soon</h3>
      <div className={styles.comingSoonGrid}>
        {COMING_SOON.map((item) => (
          <div key={item.title} className={`${styles.comingSoonCard} ${item.tone}`}>
            <div className={styles.comingSoonBadge}>Coming Soon</div>
            <div className={styles.comingSoonIcon}>
              <Icon name={item.icon} size={19} />
            </div>
            <div className={styles.comingSoonTitle}>{item.title}</div>
            <div className={styles.comingSoonDescription}>{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
