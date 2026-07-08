import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { PRODUCTS, getProduct, formatCents } from "@/lib/products";
import { addToCartAction, removeFromCartAction, checkoutCartAction } from "@/actions/shop";
import { Icon } from "@/components/Icon";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Shop · Kingdom Culture Academy" };

type SearchParams = { ordered?: string; error?: string };

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { ordered, error } = await searchParams;
  const user = await requireUser();
  const cartItems = await prisma.cartItem.findMany({ where: { userId: user.id } });

  const cartLines = cartItems
    .map((item) => {
      const product = getProduct(item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity, subtotalCents: product.priceCents * item.quantity };
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);

  const totalCents = cartLines.reduce((sum, line) => sum + line.subtotalCents, 0);

  return (
    <div>
      <h1 className={styles.title}>Shop</h1>
      <p className={styles.subtitle}>
        Resources to go deeper in the journey — and to support the ongoing work of the Kingdom.
      </p>

      <div className={styles.grid}>
        {PRODUCTS.map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imagePlaceholder}>
              <Icon name="book" size={28} color="#A85F1E" />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.productName}>{product.name}</div>
              <div className={styles.productDescription}>{product.description}</div>
              <div className={styles.cardFooter}>
                <div className={styles.price}>{formatCents(product.priceCents)}</div>
                <form action={addToCartAction.bind(null, product.id)}>
                  <button type="submit" className={styles.addButton}>
                    Add to Cart
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error === "empty-cart" ? <div className={styles.errorNotice}>Your cart is empty.</div> : null}
      {ordered === "1" && cartLines.length === 0 ? (
        <div className={styles.confirmation}>
          Thank you! Your order has been placed — a confirmation would normally be emailed to you.
        </div>
      ) : null}

      {cartLines.length > 0 ? (
        <div className={styles.cartPanel}>
          <div className={styles.cartHeading}>Your Cart</div>
          {cartLines.map((line) => (
            <div key={line.product.id} className={styles.cartLine}>
              <div className={styles.cartLineName}>
                {line.product.name} <span className={styles.cartLineQty}>×{line.quantity}</span>
              </div>
              <div className={styles.cartLineRight}>
                <div className={styles.cartLineSubtotal}>{formatCents(line.subtotalCents)}</div>
                <form action={removeFromCartAction.bind(null, line.product.id)}>
                  <button type="submit" className={styles.removeButton}>
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))}
          <div className={styles.cartTotalRow}>
            <div className={styles.cartTotal}>Total: {formatCents(totalCents)}</div>
            <form action={checkoutCartAction}>
              <button type="submit" className={styles.checkoutButton}>
                Checkout
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
