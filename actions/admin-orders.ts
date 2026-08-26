"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-session";

export async function markOrderPaidAction(orderId: string): Promise<void> {
  await requireAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "paid", paidAt: new Date() },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function markOrderPendingAction(orderId: string): Promise<void> {
  await requireAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "pending", paidAt: null },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
