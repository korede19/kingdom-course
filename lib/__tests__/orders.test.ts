import { describe, it, expect } from "vitest";
import { computeOrderItems } from "@/lib/orders";
import type { Product } from "@/lib/products";

const CATALOG: Product[] = [
  { id: "workbook", name: "Workbook", description: "d", priceCents: 1800 },
  { id: "journal", name: "Journal", description: "d", priceCents: 1400 },
];

function catalogLookup(id: string): Product | undefined {
  return CATALOG.find((p) => p.id === id);
}

describe("computeOrderItems", () => {
  it("computes total from server-side catalog prices, not client input", () => {
    const { items, totalCents } = computeOrderItems([{ productId: "workbook", quantity: 2 }], catalogLookup);
    expect(items).toHaveLength(1);
    expect(items[0]?.unitPriceCents).toBe(1800);
    expect(totalCents).toBe(3600);
  });

  it("sums multiple distinct line items correctly", () => {
    const { totalCents } = computeOrderItems(
      [
        { productId: "workbook", quantity: 1 },
        { productId: "journal", quantity: 2 },
      ],
      catalogLookup,
    );
    expect(totalCents).toBe(1800 + 1400 * 2);
  });

  it("silently drops cart entries for products no longer in the catalog", () => {
    const { items, totalCents } = computeOrderItems(
      [
        { productId: "workbook", quantity: 1 },
        { productId: "discontinued-item", quantity: 5 },
      ],
      catalogLookup,
    );
    expect(items).toHaveLength(1);
    expect(totalCents).toBe(1800);
  });

  it("returns zero total for an empty cart", () => {
    const { items, totalCents } = computeOrderItems([], catalogLookup);
    expect(items).toEqual([]);
    expect(totalCents).toBe(0);
  });

  it("ignores any price the caller tries to smuggle in on the cart item itself", () => {
    // computeOrderItems only accepts {productId, quantity} — there's no price field to trust,
    // which is the point: this test documents that guarantee at the type level and at runtime.
    const tampered = [{ productId: "workbook", quantity: 1, priceCents: 1 } as { productId: string; quantity: number }];
    const { items } = computeOrderItems(tampered, catalogLookup);
    expect(items[0]?.unitPriceCents).toBe(1800);
  });
});
