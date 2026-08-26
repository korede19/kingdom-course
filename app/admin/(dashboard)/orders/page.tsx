import type { Metadata } from "next";
import Link from "next/link";
import { getOrdersPage, type OrderStatusFilter } from "@/lib/admin-stats";
import { formatCents } from "@/lib/products";
import { formatDate } from "@/lib/format";
import { markOrderPaidAction, markOrderPendingAction } from "@/actions/admin-orders";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Orders · Admin · Kingdom Culture Academy" };

const PAGE_SIZE = 25;

type SearchParams = { status?: string; page?: string };

function isStatusFilter(value: string | undefined): value is OrderStatusFilter {
  return value === "pending" || value === "paid" || value === "all";
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const status: OrderStatusFilter = isStatusFilter(params.status) ? params.status : "pending";
  const page = Math.max(1, Number(params.page) || 1);

  const { orders, total } = await getOrdersPage({ status, page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const statusLink = (value: OrderStatusFilter) => `/admin/orders?status=${value}`;
  const pageLink = (value: number) => `/admin/orders?status=${status}&page=${value}`;

  return (
    <div>
      <h1 className={styles.title}>Orders</h1>
      <p className={styles.subtitle}>
        No payment gateway is connected yet, so mark an order paid here once you&rsquo;ve confirmed payment outside
        the app. Digital items unlock for the customer automatically as soon as an order is marked paid.
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
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <div className={styles.userName}>{order.user.name}</div>
                  <div className={styles.userEmail}>{order.user.email}</div>
                </td>
                <td>
                  {order.items.map((item) => (
                    <div key={item.id} className={styles.itemLine}>
                      {item.name} <span className={styles.itemQty}>×{item.quantity}</span>
                    </div>
                  ))}
                </td>
                <td className={styles.totalCell}>{formatCents(order.totalCents)}</td>
                <td>
                  {order.paymentStatus === "paid" ? (
                    <span className={styles.statusPaid}>Paid{order.paidAt ? ` · ${formatDate(order.paidAt)}` : ""}</span>
                  ) : (
                    <span className={styles.statusPending}>Pending</span>
                  )}
                </td>
                <td className={styles.mutedCell}>{formatDate(order.createdAt)}</td>
                <td>
                  {order.paymentStatus === "paid" ? (
                    <form action={markOrderPendingAction.bind(null, order.id)}>
                      <button type="submit" className={styles.undoButton}>
                        Undo
                      </button>
                    </form>
                  ) : (
                    <form action={markOrderPaidAction.bind(null, order.id)}>
                      <button type="submit" className={styles.payButton}>
                        Mark Paid
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyCell}>
                  No {status === "all" ? "" : status} orders.
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
