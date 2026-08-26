export type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  /** Digital products are gated behind a paid order and served from /api/downloads/[id] instead of shipped. */
  isDigital?: boolean;
  subtitle?: string;
  /** Path under /public used as the product's card image. */
  coverImage?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "sfacl-ebook",
    name: "Songs for a Changing Life",
    subtitle: "eBook (PDF)",
    description:
      "A collection of songs and reflections to carry you through seasons of change, written to be sung, prayed, and lived.",
    priceCents: 999,
    isDigital: true,
    coverImage: "/images/covers/sfacl-cover.jpg",
  },
  {
    id: "argument-resolution-ebook",
    name: "Happily, Ever After: Argument Resolution",
    subtitle: "eBook (PDF)",
    description:
      "A communication resource for every relationship. David Dixon teaches the Speaker/Listener technique, a step-by-step way to talk without fighting.",
    priceCents: 2499,
    isDigital: true,
    coverImage: "/images/covers/argument-resolution-cover.jpg",
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
