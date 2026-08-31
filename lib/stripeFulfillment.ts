import "server-only";
import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/lib/products";
import { computeOrderItems } from "@/lib/orders";

export async function fulfillCheckoutSession(session: Stripe.Checkout.Session): Promise<void> {
  const kind = session.metadata?.kind;
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") return;

  if (kind === "shop") {
    const userId = session.metadata?.userId;
    const cartJson = session.metadata?.cart;
    if (!userId || !cartJson) return;

    const cartItems = JSON.parse(cartJson) as { productId: string; quantity: number }[];
    const { items, totalCents } = computeOrderItems(cartItems, getProduct);
    if (items.length === 0) return;

    await prisma.order.upsert({
      where: { stripeSessionId: session.id },
      update: {},
      create: {
        userId,
        totalCents,
        paymentStatus: "paid",
        paidAt: new Date(),
        stripeSessionId: session.id,
        items: { create: items },
      },
    });

    await prisma.cartItem.deleteMany({ where: { userId } });
    return;
  }

  if (kind === "passport") {
    const applicationId = session.metadata?.passportApplicationId;
    if (!applicationId) return;

    // Matches on id alone, not stripeSessionId: a retried/resumed checkout overwrites the
    // application's stored session id with the newest attempt, which would otherwise orphan
    // an earlier session that actually got paid (exactly what happened when this shipped).
    await prisma.passportApplication.updateMany({
      where: { id: applicationId, paymentStatus: { not: "paid" } },
      data: { paymentStatus: "paid", paidAt: new Date(), stripeSessionId: session.id },
    });
    return;
  }

  if (kind === "donation") {
    const { userId, name, email, frequency } = session.metadata ?? {};
    if (!name || !email || !frequency) return;

    const amountCents = session.amount_total ?? 0;
    const customerId = typeof session.customer === "string" ? session.customer : null;
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;

    await prisma.donation.upsert({
      where: { stripeSessionId: session.id },
      update: {},
      create: {
        userId: userId || null,
        name,
        email,
        amountCents,
        frequency,
        paymentStatus: "paid",
        paidAt: new Date(),
        stripeSessionId: session.id,
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: customerId,
      },
    });
  }
}

export async function reconcileCheckoutSession(sessionId: string | undefined): Promise<void> {
  if (!sessionId) return;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    await fulfillCheckoutSession(session);
  } catch (err) {
    console.error("Checkout session reconciliation failed:", err);
  }
}
