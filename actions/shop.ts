"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getProduct } from "@/lib/products";
import { computeOrderItems } from "@/lib/orders";
import { getStripe, getAppUrl } from "@/lib/stripe";

const productIdSchema = z.string().min(1);

export async function addToCartAction(productId: string): Promise<void> {
  const parsed = productIdSchema.safeParse(productId);
  if (!parsed.success || !getProduct(parsed.data)) {
    throw new Error("Unknown product.");
  }
  const user = await requireUser();

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: user.id, productId: parsed.data } },
  });

  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + 1 } });
  } else {
    await prisma.cartItem.create({ data: { userId: user.id, productId: parsed.data, quantity: 1 } });
  }

  revalidatePath("/shop");
}

export async function removeFromCartAction(productId: string): Promise<void> {
  const user = await requireUser();
  await prisma.cartItem.deleteMany({ where: { userId: user.id, productId } });
  revalidatePath("/shop");
}

/**
 * The Order (and its OrderItems) is only ever created once Stripe confirms payment,
 * inside the webhook handler — not here. Creating it up front, before the user has
 * actually paid, would leave a permanent "Payment Pending" product on the shop page
 * with no way to retry if they simply close or cancel the Stripe checkout page.
 */
export async function checkoutCartAction(): Promise<void> {
  const user = await requireUser();
  const cartItems = await prisma.cartItem.findMany({ where: { userId: user.id } });

  if (cartItems.length === 0) {
    redirect("/shop?error=empty-cart");
  }

  const { items: orderItems } = computeOrderItems(cartItems, getProduct);

  if (orderItems.length === 0) {
    redirect("/shop?error=empty-cart");
  }

  const appUrl = getAppUrl();
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: user.email,
    line_items: orderItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.unitPriceCents,
        product_data: { name: item.name },
      },
    })),
    metadata: {
      kind: "shop",
      userId: user.id,
      cart: JSON.stringify(cartItems.map((item) => ({ productId: item.productId, quantity: item.quantity }))),
    },
    success_url: `${appUrl}/shop?ordered=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/shop?error=cancelled`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  redirect(session.url);
}
