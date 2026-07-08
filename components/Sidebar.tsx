"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { Icon } from "@/components/Icon";
import { initials } from "@/lib/format";
import styles from "./Sidebar.module.css";

type NavItem = {
  href: string;
  label: string;
  icon: "grid" | "book" | "certificate" | "cart" | "heart";
  isActive: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "grid", isActive: (p) => p === "/dashboard" },
  { href: "/course", label: "Progress Map", icon: "book", isActive: (p) => p.startsWith("/course") },
  { href: "/certificate", label: "Certificate", icon: "certificate", isActive: (p) => p === "/certificate" },
  { href: "/shop", label: "Shop", icon: "cart", isActive: (p) => p === "/shop" },
  { href: "/give", label: "Give", icon: "heart", isActive: (p) => p === "/give" },
];

export function Sidebar({ userName, cartCount }: { userName: string; cartCount: number }) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href="/dashboard" className={styles.brand}>
        <div className={styles.brandBadge}>
          <Icon name="shield" size={18} color="#D2823C" />
        </div>
        <span className={styles.brandName}>Kingdom Culture Academy</span>
      </Link>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname);
          return (
            <Link key={item.href} href={item.href} className={active ? styles.navItemActive : styles.navItem}>
              <span className={styles.navIcon}>
                <Icon name={item.icon} size={18} />
              </span>
              {item.label}
              {item.icon === "cart" && cartCount > 0 ? <span className={styles.cartBadge}>{cartCount}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className={styles.spacer} />

      <div className={styles.profile}>
        <div className={styles.avatar}>{initials(userName)}</div>
        <div className={styles.profileInfo}>
          <div className={styles.profileName}>{userName}</div>
          <form action={logoutAction}>
            <button type="submit" className={styles.logout}>
              <Icon name="logout" size={14} color="#8FAFA6" />
              Log Out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
