import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { Icon } from "@/components/Icon";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Introduction · Kingdom Culture Academy" };

export default async function IntroductionPage() {
  await requireUser();

  return (
    <div>
      <Link href="/course" className={styles.backLink}>
        <Icon name="chevronLeft" size={16} /> Back to Progress Map
      </Link>

      <div className={styles.badgeRow}>
        <span className={styles.lessonBadge}>Introduction</span>
      </div>

      <h1 className={styles.title}>Kingdom Culture Academy</h1>

      <div className={styles.panel}>
        <p className={styles.paragraph}>
          Upon observing someone in the process of legally immigrating into the United States, the final test was 12
          questions randomly chosen from 120 related to the culture and constitution of the United States. Wow, not
          only could I not answer those questions, but I believe that 90% of the American population could not pass
          that test. We no longer teach civics and have so many different peoples that have integrated into this
          so-called melting pot called United States of America that we don&rsquo;t actually have and observe a
          singular culture.
        </p>

        <p className={styles.paragraph}>
          Then remembering that our first admonition of King Jesus was to seek first the Kingdom and be in right
          standing with it. This awakening gave birth to the creation of the &ldquo;Kingdom Culture Academy.&rdquo; I
          realized that I had been a Christian all my life and never did what Jesus said I should do first:
          &ldquo;Seek, understand, and be rightly aligned with the culture of the Kingdom of Heaven.&rdquo;
        </p>

        <p className={styles.paragraph}>
          This course should be primary, the first course taught in every church across the world.
        </p>

        <p className={styles.paragraph}>
          Jesus came to colonize earth, to influence it with the greater culture of heaven. He was a living,
          breathing demonstration of the very nature of the Father, and of how the heavenly culture is supposed to
          influence the nations of earth. This is to be accomplished through you and I, His children.
        </p>

        <Link href="/course/1" className={styles.continueButton}>
          Begin Lesson 1 →
        </Link>
      </div>
    </div>
  );
}
