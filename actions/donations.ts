"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getStripe, getAppUrl } from "@/lib/stripe";

const donationSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name and email."),
  email: z.string().trim().min(1, "Please enter your name and email.").pipe(z.email("Enter a valid email address.")),
  amount: z.number().positive("Please choose or enter a gift amount."),
  frequency: z.enum(["once", "monthly"]),
});

export type DonationState = { error: string } | null;

/**
 * No Donation row is created here — only once Stripe confirms the payment (webhook),
 * for a one-time gift, or once the first invoice on the subscription is paid, for a
 * monthly gift. That keeps an abandoned Stripe checkout from ever leaving a stray
 * "pending" gift behind.
 */
export async function submitDonationAction(
  _prevState: DonationState,
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
    return { error: parsed.error.issues[0]?.message ?? "Please check your gift details." };
  }

  const { name, email, amount, frequency } = parsed.data;
  const amountCents = Math.round(amount * 100);
  const appUrl = getAppUrl();
  const metadata = { kind: "donation", userId: user.id, name, email, frequency };

  const session =
    frequency === "monthly"
      ? await getStripe().checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          customer_email: email,
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: amountCents,
                recurring: { interval: "month" },
                product_data: { name: "Kingdom Culture Academy — Monthly Gift" },
              },
            },
          ],
          metadata,
          subscription_data: { metadata },
          success_url: `${appUrl}/give?thanks=1&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${appUrl}/give?error=cancelled`,
        })
      : await getStripe().checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          customer_email: email,
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: amountCents,
                product_data: { name: "Kingdom Culture Academy — Gift" },
              },
            },
          ],
          metadata,
          success_url: `${appUrl}/give?thanks=1&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${appUrl}/give?error=cancelled`,
        });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  redirect(session.url);
}
