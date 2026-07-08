import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/Sidebar";
import styles from "./layout.module.css";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const cartItems = await prisma.cartItem.findMany({ where: { userId: user.id } });
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={styles.shell}>
      <Sidebar userName={user.name} cartCount={cartCount} />
      <div className={styles.content}>
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
}
