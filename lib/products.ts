export type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
};

export const PRODUCTS: Product[] = [
  {
    id: "workbook",
    name: "Kingdom Culture Academy Workbook",
    description: "The full companion workbook with notes space for all 10 lessons.",
    priceCents: 1800,
  },
  {
    id: "journal",
    name: "Ambassador's Journal",
    description: "A guided journal for reflection questions and prayer.",
    priceCents: 1400,
  },
  {
    id: "bundle",
    name: "Course Bundle (Print + Journal)",
    description: "The printed workbook and journal together, at a bundled price.",
    priceCents: 2800,
  },
  {
    id: "wristband",
    name: "Kingdom Culture Wristband",
    description: "A simple daily reminder of your citizenship in the Kingdom.",
    priceCents: 800,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
