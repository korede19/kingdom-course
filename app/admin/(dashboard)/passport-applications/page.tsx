import type { Metadata } from "next";
import Link from "next/link";
import { getPassportApplicationsPage, type OrderStatusFilter } from "@/lib/admin-stats";
import { formatCents } from "@/lib/products";
import { formatDate } from "@/lib/format";
import { markPassportPaidAction, markPassportPendingAction } from "@/actions/admin-passport";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Passport Applications · Admin · Kingdom Culture Academy" };

const PAGE_SIZE = 25;

type SearchParams = { status?: string; page?: string };

function isStatusFilter(value: string | undefined): value is OrderStatusFilter {
  return value === "pending" || value === "paid" || value === "all";
}

export default async function AdminPassportApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status: OrderStatusFilter = isStatusFilter(params.status) ? params.status : "pending";
  const page = Math.max(1, Number(params.page) || 1);

  const { applications, total } = await getPassportApplicationsPage({ status, page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const statusLink = (value: OrderStatusFilter) => `/admin/passport-applications?status=${value}`;
  const pageLink = (value: number) => `/admin/passport-applications?status=${status}&page=${value}`;

  return (
    <div>
      <h1 className={styles.title}>Passport Applications</h1>
      <p className={styles.subtitle}>
        Mark an application paid once you&rsquo;ve confirmed the $50 fee outside the app. The applicant&rsquo;s
        Kingdom Passport is issued automatically as soon as it&rsquo;s marked paid.
      </p>

      <div className={styles.filterRow}>
        <Link href={statusLink("pending")} className={status === "pending" ? styles.filterActive : styles.filterLink}>
          Pending
        </Link>
        <Link href={statusLink("paid")} className={status === "paid" ? styles.filterActive : styles.filterLink}>
          Paid
        </Link>
        <Link href={statusLink("all")} className={status === "all" ? styles.filterActive : styles.filterLink}>
          All
        </Link>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Applicant</th>
              <th>Country</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Submitted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td>
                  {application.pictureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={application.pictureUrl} alt={application.fullName} className={styles.thumb} />
                  ) : (
                    <div className={styles.thumbEmpty} />
                  )}
                </td>
                <td>
                  <div className={styles.userName}>{application.fullName}</div>
                  <div className={styles.userEmail}>{application.user.email}</div>
                  <div className={styles.userAddress}>{application.address}</div>
                </td>
                <td>{application.country}</td>
                <td className={styles.totalCell}>{formatCents(application.feeCents)}</td>
                <td>
                  {application.paymentStatus === "paid" ? (
                    <span className={styles.statusPaid}>
                      Paid{application.paidAt ? ` · ${formatDate(application.paidAt)}` : ""}
                    </span>
                  ) : (
                    <span className={styles.statusPending}>Pending</span>
                  )}
                </td>
                <td className={styles.mutedCell}>{formatDate(application.createdAt)}</td>
                <td>
                  {application.paymentStatus === "paid" ? (
                    <form action={markPassportPendingAction.bind(null, application.id)}>
                      <button type="submit" className={styles.undoButton}>
                        Undo
                      </button>
                    </form>
                  ) : (
                    <form action={markPassportPaidAction.bind(null, application.id)}>
                      <button type="submit" className={styles.payButton}>
                        Mark Paid
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {applications.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyCell}>
                  No {status === "all" ? "" : status} applications.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className={styles.pagination}>
          <Link
            href={pageLink(Math.max(1, page - 1))}
            aria-disabled={page <= 1}
            className={page <= 1 ? styles.pageButtonDisabled : styles.pageButton}
          >
            ← Previous
          </Link>
          <span className={styles.pageStatus}>
            Page {page} of {totalPages}
          </span>
          <Link
            href={pageLink(Math.min(totalPages, page + 1))}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? styles.pageButtonDisabled : styles.pageButton}
          >
            Next →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
