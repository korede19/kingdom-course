import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { fulfillCheckoutSession } from "@/lib/stripeFulfillment";

export const dynamic = "force-dynamic";

async function handleReversal(charge: Stripe.Charge) {
  const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
  if (!paymentIntentId) return;

  const sessions = await getStripe().checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 });
  const session = sessions.data[0];
  if (!session) return;

  await Promise.all([
    prisma.order.updateMany({ where: { stripeSessionId: session.id }, data: { paymentStatus: "refunded" } }),
    prisma.passportApplication.updateMany({
      where: { stripeSessionId: session.id },
      data: { paymentStatus: "refunded" },
    }),
    prisma.donation.updateMany({ where: { stripeSessionId: session.id }, data: { paymentStatus: "refunded" } }),
  ]);
}

/** Records each recurring monthly-gift charge as its own Donation row, after the first (handled by checkout.session.completed). */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (invoice.billing_reason !== "subscription_cycle") return;

  const subscriptionId = typeof invoice.parent?.subscription_details?.subscription === "string"
    ? invoice.parent.subscription_details.subscription
    : null;
  if (!subscriptionId) return;

  const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
  const { userId, name, email, frequency } = subscription.metadata ?? {};
  if (!name || !email) return;

  const customerId = typeof invoice.customer === "string" ? invoice.customer : null;

  await prisma.donation.upsert({
    where: { stripeInvoiceId: invoice.id },
    update: {},
    create: {
      userId: userId || null,
      name,
      email,
      amountCents: invoice.amount_paid,
      frequency: frequency || "monthly",
      paymentStatus: "paid",
      paidAt: new Date(),
      stripeInvoiceId: invoice.id,
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: customerId,
    },
  });
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await fulfillCheckoutSession(event.data.object);
    } else if (event.type === "invoice.paid") {
      await handleInvoicePaid(event.data.object);
    } else if (event.type === "charge.refunded") {
      // charge.refunded also fires for partial refunds; only revoke once the full amount is back.
      if (event.data.object.refunded) {
        await handleReversal(event.data.object);
      }
    } else if (event.type === "charge.dispute.created") {
      const charge = await getStripe().charges.retrieve(
        typeof event.data.object.charge === "string" ? event.data.object.charge : event.data.object.charge.id,
      );
      await handleReversal(charge);
    }
  } catch (err) {
    console.error("Stripe webhook handling failed:", err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
