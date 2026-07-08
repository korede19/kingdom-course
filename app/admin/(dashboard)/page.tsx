import type { Metadata } from "next";
import Link from "next/link";
import { getOverviewStats, getUsersPage, type UserSort } from "@/lib/admin-stats";
import { formatCents } from "@/lib/products";
import { formatDate } from "@/lib/format";
import { ProgressBar } from "@/components/ProgressBar";
import { Icon } from "@/components/Icon";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Admin Overview · Kingdom Culture Academy" };

const PAGE_SIZE = 25;

type SearchParams = { q?: string; sort?: string; page?: string };

function isUserSort(value: string | undefined): value is UserSort {
  return value === "name" || value === "email" || value === "recent";
}

export default async function AdminOverviewPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const search = (params.q ?? "").trim();
  const sort: UserSort = isUserSort(params.sort) ? params.sort : "recent";
  const page = Math.max(1, Number(params.page) || 1);

  const [stats, { users, total }] = await Promise.all([
    getOverviewStats(),
    getUsersPage({ search, page, pageSize: PAGE_SIZE, sort }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const sortLink = (value: UserSort) => `/admin?${new URLSearchParams({ ...(search ? { q: search } : {}), sort: value }).toString()}`;
  const pageLink = (value: number) =>
    `/admin?${new URLSearchParams({ ...(search ? { q: search } : {}), sort, page: String(value) }).toString()}`;

  return (
    <div>
      <h1 className={styles.title}>Overview</h1>
      <p className={styles.subtitle}>Users, progress, and revenue across Kingdom Culture Academy.</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGold}`}>
            <Icon name="user" size={22} color="#A85F1E" />
          </div>
          <div className={styles.statBody}>
            <div className={styles.statValue}>{stats.totalUsers.toLocaleString()}</div>
            <div className={styles.statLabel}>Total Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGold}`}>
            <Icon name="certificate" size={22} color="#A85F1E" />
          </div>
          <div className={styles.statBody}>
            <div className={styles.statValue}>{stats.certificatesEarned.toLocaleString()}</div>
            <div className={styles.statLabel}>Certificates Earned</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGold}`}>
            <Icon name="star" size={22} color="#A85F1E" />
          </div>
          <div className={styles.statBody}>
            <div className={styles.statValue}>{stats.avgCompletionPercent}%</div>
            <div className={styles.statLabel}>Avg. Completion</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
            <Icon name="cart" size={22} color="#123B36" />
          </div>
          <div className={styles.statBody}>
            <div className={styles.statValue}>{formatCents(stats.orderRevenueCents)}</div>
            <div className={styles.statLabel}>Shop Revenue</div>
            <div className={styles.statMeta}>{stats.orderCount} order{stats.orderCount === 1 ? "" : "s"}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
            <Icon name="heart" size={22} color="#123B36" />
          </div>
          <div className={styles.statBody}>
            <div className={styles.statValue}>{formatCents(stats.donationTotalCents)}</div>
            <div className={styles.statLabel}>Donations</div>
            <div className={styles.statMeta}>{stats.donationCount} gift{stats.donationCount === 1 ? "" : "s"}</div>
          </div>
        </div>
      </div>

      <div className={styles.tableHeader}>
        <form className={styles.searchForm} action="/admin">
          <input type="hidden" name="sort" value={sort} />
          <input
            type="search"
            name="q"
            placeholder="Search by name or email…"
            defaultValue={search}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
        <div className={styles.sortLinks}>
          <span className={styles.sortLabel}>Sort:</span>
          <Link href={sortLink("recent")} className={sort === "recent" ? styles.sortActive : styles.sortLink}>
            Newest
          </Link>
          <Link href={sortLink("name")} className={sort === "name" ? styles.sortActive : styles.sortLink}>
            Name
          </Link>
          <Link href={sortLink("email")} className={sort === "email" ? styles.sortActive : styles.sortLink}>
            Email
          </Link>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Joined</th>
              <th>Progress</th>
              <th>Badges</th>
              <th>Certificate</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link href={`/admin/users/${user.id}`} className={styles.userLink}>
                    <div className={styles.userName}>{user.name}</div>
                    <div className={styles.userEmail}>{user.email}</div>
                  </Link>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <div className={styles.progressCell}>
                    <ProgressBar percent={user.completionPercent} height={6} />
                    <span className={styles.progressLabel}>
                      {user.lessonsCompleted}/10
                    </span>
                  </div>
                </td>
                <td>{user.badges}</td>
                <td>
                  {user.certificateDate ? (
                    <span className={styles.certYes}>{formatDate(user.certificateDate)}</span>
                  ) : (
                    <span className={styles.certNo}>Not yet</span>
                  )}
                </td>
                <td className={styles.mutedCell}>{formatDate(user.lastActivity)}</td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyCell}>
                  No users found.
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
