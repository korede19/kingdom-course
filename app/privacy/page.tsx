import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = { title: "Privacy Policy · Kingdom Culture Academy" };

const LAST_UPDATED = "July 23, 2026";

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>
        <div className={styles.card}>
          <div className={styles.brand}>Kingdom Culture Academy</div>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.updated}>Last updated {LAST_UPDATED}</p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Information we collect</h2>
            <ul>
              <li>Account details: your name, email address, and password (stored as a secure hash, never in plain text).</li>
              <li>Course activity: lesson progress, quiz scores and attempts, badges earned, and reflection answers you write.</li>
              <li>Shop and giving records: items ordered and donations made through your account, including the name/email/amount you enter.</li>
              <li>Basic technical data: session cookies needed to keep you signed in.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How we use it</h2>
            <ul>
              <li>To operate your account, track your course progress, and issue your certificate.</li>
              <li>To process shop orders and donation records you submit.</li>
              <li>To send you account-related emails, such as password resets and course-completion notices.</li>
              <li>To keep the service secure and prevent abuse.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. What we don&apos;t do</h2>
            <p>
              We do not sell your personal information. We do not run third-party advertising or analytics
              trackers on this site. We do not store full payment card numbers on our servers.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Cookies</h2>
            <p>
              We use a single, essential session cookie to keep you signed in. It is not used for advertising or
              cross-site tracking, and it&apos;s removed when you log out.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Data storage and security</h2>
            <p>
              Your data is stored in a managed PostgreSQL database. Passwords are hashed with bcrypt before
              storage. We take reasonable technical measures to protect your data, but no online service can
              guarantee absolute security.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Your choices</h2>
            <p>
              You can update your account details from your dashboard. To request a copy of your data or to
              request deletion of your account, email us at the address below — we&apos;ll respond within a
              reasonable time.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Children&apos;s privacy</h2>
            <p>The Academy is not directed at children under 13, and we do not knowingly collect data from them.</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Changes to this policy</h2>
            <p>We may update this policy from time to time. We&apos;ll update the date at the top when we do.</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Contact</h2>
            <p>
              Questions about this policy or your data? Email{" "}
              <a href="mailto:support@kingdomcultureacademy.com">support@kingdomcultureacademy.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
