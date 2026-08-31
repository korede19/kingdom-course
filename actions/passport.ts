"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getStripe, getAppUrl } from "@/lib/stripe";

export type PassportApplyState = { error: string } | null;

const applySchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  address: z.string().trim().min(4, "Enter your address.").max(300),
  country: z.string().trim().min(2, "Enter your country.").max(100),
  pictureUrl: z
    .string()
    .trim()
    .min(1, "Please upload a photo.")
    .refine((v) => v.startsWith("data:image/"), "Please upload a valid photo."),
});

async function startPassportCheckout(
  applicationId: string,
  feeCents: number,
  userEmail: string,
): Promise<string> {
  const appUrl = getAppUrl();
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: userEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: feeCents,
          product_data: { name: "Kingdom Passport Application Fee" },
        },
      },
    ],
    metadata: { kind: "passport", passportApplicationId: applicationId },
    success_url: `${appUrl}/passport?submitted=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/passport?error=cancelled`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  await prisma.passportApplication.update({
    where: { id: applicationId },
    data: { stripeSessionId: session.id },
  });

  return session.url;
}

export async function submitPassportApplicationAction(
  _prevState: PassportApplyState,
  formData: FormData,
): Promise<PassportApplyState> {
  const parsed = applySchema.safeParse({
    fullName: formData.get("fullName"),
    address: formData.get("address"),
    country: formData.get("country"),
    pictureUrl: formData.get("pictureUrl"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
  }

  const user = await requireUser();

  const existing = await prisma.passportApplication.findUnique({ where: { userId: user.id } });
  if (existing) {
    return { error: "You already have a passport application on file." };
  }

  const application = await prisma.passportApplication.create({
    data: {
      userId: user.id,
      fullName: parsed.data.fullName,
      address: parsed.data.address,
      country: parsed.data.country,
      pictureUrl: parsed.data.pictureUrl,
    },
  });

  revalidatePath("/passport");
  const checkoutUrl = await startPassportCheckout(application.id, application.feeCents, user.email);
  redirect(checkoutUrl);
}

/** Lets an applicant retry payment after cancelling or abandoning the Stripe checkout page. */
export async function resumePassportPaymentAction(): Promise<void> {
  const user = await requireUser();

  const application = await prisma.passportApplication.findUnique({ where: { userId: user.id } });
  if (!application || application.paymentStatus === "paid") {
    redirect("/passport");
  }

  const checkoutUrl = await startPassportCheckout(application.id, application.feeCents, user.email);
  redirect(checkoutUrl);
}
