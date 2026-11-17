"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { LogoMark } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { initials } from "@/lib/format";
import styles from "./Sidebar.module.css";

type NavItem = {
  href: string;
  label: string;
  icon: "grid" | "book" | "certificate" | "cart" | "heart" | "passport";
  isActive: (pathname: string) => boolean;
  special?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "grid", isActive: (p) => p === "/dashboard" },
  { href: "/course", label: "Progress Map", icon: "book", isActive: (p) => p.startsWith("/course") },
  { href: "/certificate", label: "Certificate", icon: "certificate", isActive: (p) => p === "/certificate" },
  {
    href: "/passport",
    label: "Kingdom Passport",
    icon: "passport",
    isActive: (p) => p === "/passport",
    special: true,
  },
  { href: "/shop", label: "Shop", icon: "cart", isActive: (p) => p === "/shop" },
  { href: "/give", label: "Give", icon: "heart", isActive: (p) => p === "/give" },
];

export function Sidebar({ userName, cartCount }: { userName: string; cartCount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className={styles.topbar}>
        <Link href="/dashboard" className={styles.topbarBrand}>
          <LogoMark size={30} color="var(--color-gold)" />
          <span className={styles.topbarBrandName}>Kingdom Culture Academy</span>
        </Link>
        <button
          type="button"
          className={styles.menuButton}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" size={22} color="#f7efdc" />
        </button>
      </div>

      {open ? <div className={styles.overlay} onClick={() => setOpen(false)} /> : null}

      <aside className={open ? `${styles.sidebar} ${styles.sidebarOpen}` : styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard" className={styles.brand}>
            <LogoMark size={34} color="var(--color-gold)" />
            <span className={styles.brandName}>Kingdom Culture Academy</span>
          </Link>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <Icon name="close" size={20} color="#b9cfc7" />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const active = item.isActive(pathname);
            const className = item.special
              ? active
                ? styles.navItemPassportActive
                : styles.navItemPassport
              : active
                ? styles.navItemActive
                : styles.navItem;
            return (
              <Link key={item.href} href={item.href} className={className}>
                <span className={styles.navIcon}>
                  <Icon name={item.icon} size={18} color={item.special ? "#F2C99B" : undefined} />
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
    </>
  );
}
