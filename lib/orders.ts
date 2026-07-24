import type { Product } from "@/lib/products";

export type OrderLineItem = {
  productId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
};

/**
 * Pure order computation: prices always come from the server-side product catalog
 * (via getProduct), never from client input, so this can't be tampered with. Unknown
 * product ids (e.g. a since-removed product still sitting in someone's cart) are dropped.
 */
export function computeOrderItems(
  cartItems: { productId: string; quantity: number }[],
  getProduct: (id: string) => Product | undefined,
): { items: OrderLineItem[]; totalCents: number } {
  const items = cartItems
    .map((item): OrderLineItem | null => {
      const product = getProduct(item.productId);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        unitPriceCents: product.priceCents,
        quantity: item.quantity,
      };
    })
    .filter((item): item is OrderLineItem => item !== null);

  const totalCents = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);

  return { items, totalCents };
}
