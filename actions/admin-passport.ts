"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-session";

export async function markPassportPaidAction(applicationId: string): Promise<void> {
  await requireAdmin();

  await prisma.passportApplication.update({
    where: { id: applicationId },
    data: { paymentStatus: "paid", paidAt: new Date() },
  });

  revalidatePath("/admin/passport-applications");
  revalidatePath("/admin");
}

export async function markPassportPendingAction(applicationId: string): Promise<void> {
  await requireAdmin();

  await prisma.passportApplication.update({
    where: { id: applicationId },
    data: { paymentStatus: "pending", paidAt: null },
  });

  revalidatePath("/admin/passport-applications");
  revalidatePath("/admin");
}
