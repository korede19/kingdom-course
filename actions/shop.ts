"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getProduct } from "@/lib/products";

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

export async function checkoutCartAction(): Promise<void> {
  const user = await requireUser();
  const cartItems = await prisma.cartItem.findMany({ where: { userId: user.id } });

  if (cartItems.length === 0) {
    redirect("/shop?error=empty-cart");
  }

  const orderItems = cartItems
    .map((item) => {
      const product = getProduct(item.productId);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        unitPriceCents: product.priceCents,
        quantity: item.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const totalCents = orderItems.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);

  await prisma.$transaction([
    prisma.order.create({
      data: {
        userId: user.id,
        totalCents,
        items: { create: orderItems },
      },
    }),
    prisma.cartItem.deleteMany({ where: { userId: user.id } }),
  ]);

  revalidatePath("/shop");
  redirect("/shop?ordered=1");
}
