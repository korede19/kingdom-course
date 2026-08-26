import "server-only";
import { prisma } from "@/lib/db";

export type PurchaseStatus = "none" | "pending" | "paid";

/** Maps productId -> the user's best order status for that product ("paid" wins over "pending"). */
export async function getUserPurchaseStatuses(userId: string): Promise<Map<string, PurchaseStatus>> {
  const items = await prisma.orderItem.findMany({
    where: { order: { userId } },
    select: { productId: true, order: { select: { paymentStatus: true } } },
  });

  const statuses = new Map<string, PurchaseStatus>();
  for (const item of items) {
    const status: PurchaseStatus = item.order.paymentStatus === "paid" ? "paid" : "pending";
    const existing = statuses.get(item.productId);
    if (existing !== "paid") {
      statuses.set(item.productId, status);
    }
  }
  return statuses;
}
