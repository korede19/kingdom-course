import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = { title: "Terms of Service · Kingdom Culture Academy" };

const LAST_UPDATED = "July 23, 2026";

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>
        <div className={styles.card}>
          <div className={styles.brand}>Kingdom Culture Academy</div>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.updated}>Last updated {LAST_UPDATED}</p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptance of terms</h2>
            <p>
              By creating an account or using Kingdom Culture Academy (&quot;the Academy&quot;, &quot;we&quot;,
              &quot;us&quot;), you agree to these Terms of Service. If you do not agree, please do not use the
              service.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. The service</h2>
            <p>
              The Academy is a 10-lesson online course consisting of readings, quizzes, reflection exercises,
              badges, and a certificate of completion issued once all lessons are passed. We may update, add to,
              or reorder course content at any time.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Accounts</h2>
            <p>
              You must provide accurate information when registering and are responsible for keeping your login
              credentials confidential and for all activity under your account. Tell us right away if you suspect
              unauthorized access.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Course progress and certificates</h2>
            <p>
              Quiz attempts, cooldowns, and pass thresholds apply as shown in the course. Your certificate of
              completion is issued in your name as entered at registration and reflects the badges you have
              actually earned — we may revoke a certificate obtained through fraudulent means (for example,
              tampering with quiz submissions).
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Shop orders and donations</h2>
            <p>
              Items purchased through the Shop and gifts made through Give are recorded against your account.
              Prices are shown at the time of purchase. We do not store full payment card details on our
              servers; any payment is handled through the checkout method shown at the time.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Your content</h2>
            <p>
              Reflection answers and other content you submit remain yours. By submitting them, you give us
              permission to store and display them back to you within the course, and to use anonymized,
              aggregated learnings to improve the course.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Acceptable use</h2>
            <ul>
              <li>Do not attempt to bypass quiz cooldowns, attempt limits, or lesson unlock order.</li>
              <li>Do not share your account or resell access to the course.</li>
              <li>Do not use the service for any unlawful purpose.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Intellectual property</h2>
            <p>
              All lesson content, quizzes, and course materials are the property of Kingdom Culture Academy and
              may not be copied, redistributed, or republished without permission.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Termination</h2>
            <p>
              We may suspend or terminate accounts that violate these terms. You may stop using the service at
              any time.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Disclaimer</h2>
            <p>
              The service is provided &quot;as is&quot; without warranties of any kind. We are not liable for
              indirect or incidental damages arising from your use of the service.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Changes to these terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the service after a change means you
              accept the updated terms.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>12. Contact</h2>
            <p>
              Questions about these terms? Email{" "}
              <a href="mailto:support@kingdomcultureacademy.com">support@kingdomcultureacademy.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
