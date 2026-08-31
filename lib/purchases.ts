import "server-only";
import { prisma } from "@/lib/db";

export type PurchaseStatus = "none" | "pending" | "paid" | "refunded";

export async function getUserPurchaseStatuses(userId: string): Promise<Map<string, PurchaseStatus>> {
  const items = await prisma.orderItem.findMany({
    where: { order: { userId } },
    select: { productId: true, order: { select: { paymentStatus: true } } },
  });

  const rank: Record<PurchaseStatus, number> = { refunded: 0, pending: 1, paid: 2, none: -1 };

  const statuses = new Map<string, PurchaseStatus>();
  for (const item of items) {
    const status: PurchaseStatus =
      item.order.paymentStatus === "paid" || item.order.paymentStatus === "refunded"
        ? item.order.paymentStatus
        : "pending";
    const existing = statuses.get(item.productId);
    if (!existing || rank[status] > rank[existing]) {
      statuses.set(item.productId, status);
    }
  }
  return statuses;
}
