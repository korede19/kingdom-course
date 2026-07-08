import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserDetail } from "@/lib/admin-stats";
import { LESSONS } from "@/lib/lessons-data";
import { formatCents } from "@/lib/products";
import { formatDate, initials } from "@/lib/format";
import { Icon } from "@/components/Icon";
import styles from "./page.module.css";

type Params = { userId: string };

export const metadata: Metadata = { title: "User Detail · Admin Console" };

export default async function AdminUserDetailPage({ params }: { params: Promise<Params> }) {
  const { userId } = await params;
  const user = await getUserDetail(userId);
  if (!user) notFound();

  const progressByLesson = new Map(user.progress.map((p) => [p.lessonNum, p]));
  const lessonsCompleted = user.progress.filter((p) => p.quizPassed).length;
  const badges = user.progress.filter((p) => p.badgeEarned).length;
  const orderTotalCents = user.orders.reduce((sum, o) => sum + o.totalCents, 0);
  const donationTotalCents = user.donations.reduce((sum, d) => sum + d.amountCents, 0);

  return (
    <div>
      <Link href="/admin" className={styles.backLink}>
        <Icon name="chevronLeft" size={16} /> Back to Overview
      </Link>

      <div className={styles.headerCard}>
        <div className={styles.avatar}>{initials(user.name)}</div>
        <div className={styles.headerInfo}>
          <h1 className={styles.userName}>{user.name}</h1>
          <div className={styles.userEmail}>{user.email}</div>
          <div className={styles.metaRow}>
            <span>Joined {formatDate(user.createdAt)}</span>
            <span>·</span>
            <span>{lessonsCompleted}/10 lessons complete</span>
            <span>·</span>
            <span>{badges} badges</span>
            <span>·</span>
            {user.completionDate ? (
              <span className={styles.certYes}>Certified {formatDate(user.completionDate)}</span>
            ) : (
              <span className={styles.certNo}>Certificate not earned</span>
            )}
          </div>
        </div>
      </div>

      <h2 className={styles.sectionHeading}>Lesson Progress</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Lesson</th>
              <th>Read</th>
              <th>Quiz Passed</th>
              <th>Best Score</th>
              <th>Attempts</th>
              <th>Badge</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {LESSONS.map((lesson) => {
              const progress = progressByLesson.get(lesson.num);
              return (
                <tr key={lesson.num}>
                  <td>{lesson.num}</td>
                  <td className={styles.lessonTitleCell}>{lesson.title}</td>
                  <td>{progress?.read ? <Icon name="check" size={15} color="#0B7A5A" /> : "—"}</td>
                  <td>{progress?.quizPassed ? <Icon name="check" size={15} color="#0B7A5A" /> : "—"}</td>
                  <td>{progress ? `${progress.bestScore}/10` : "—"}</td>
                  <td>{progress?.attempts ?? 0}</td>
                  <td>{progress?.badgeEarned ? <Icon name="certificate" size={15} color="#A85F1E" /> : "—"}</td>
                  <td className={styles.mutedCell}>{progress ? formatDate(progress.updatedAt) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className={styles.sectionHeading}>
        Shop Orders <span className={styles.sectionTotal}>{formatCents(orderTotalCents)} total</span>
      </h2>
      {user.orders.length === 0 ? (
        <p className={styles.emptyText}>No orders placed.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {user.orders.map((order) => (
                <tr key={order.id}>
                  <td className={styles.mutedCell}>{formatDate(order.createdAt)}</td>
                  <td>
                    {order.items.map((item) => `${item.name} ×${item.quantity}`).join(", ")}
                  </td>
                  <td>{formatCents(order.totalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className={styles.sectionHeading}>
        Donations <span className={styles.sectionTotal}>{formatCents(donationTotalCents)} total</span>
      </h2>
      {user.donations.length === 0 ? (
        <p className={styles.emptyText}>No donations given.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {user.donations.map((donation) => (
                <tr key={donation.id}>
                  <td className={styles.mutedCell}>{formatDate(donation.createdAt)}</td>
                  <td>{formatCents(donation.amountCents)}</td>
                  <td>{donation.frequency === "monthly" ? "Monthly" : "One-time"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
