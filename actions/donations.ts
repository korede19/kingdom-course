"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

const donationSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name and email."),
  email: z.string().trim().min(1, "Please enter your name and email.").pipe(z.email("Enter a valid email address.")),
  amount: z.number().positive("Please choose or enter a gift amount."),
  frequency: z.enum(["once", "monthly"]),
});

export type DonationState =
  | { ok: false; error: string }
  | { ok: true; amountLabel: string; freqLabel: string; email: string };

export async function submitDonationAction(
  _prevState: DonationState | null,
  formData: FormData,
): Promise<DonationState> {
  const user = await requireUser();

  const amountRaw = formData.get("amount");
  const parsed = donationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    amount: typeof amountRaw === "string" ? Number(amountRaw) : NaN,
    frequency: formData.get("frequency"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your gift details." };
  }

  const { name, email, amount, frequency } = parsed.data;
  const amountCents = Math.round(amount * 100);

  await prisma.donation.create({
    data: { userId: user.id, name, email, amountCents, frequency },
  });

  return {
    ok: true,
    amountLabel: `$${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`,
    freqLabel: frequency === "monthly" ? "monthly" : "one-time",
    email,
  };
}
