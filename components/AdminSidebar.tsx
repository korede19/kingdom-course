"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogoutAction } from "@/actions/admin-auth";
import { Icon } from "@/components/Icon";
import { initials } from "@/lib/format";
import styles from "./AdminSidebar.module.css";

export function AdminSidebar({ adminName }: { adminName: string }) {
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
        <Link href="/admin" className={styles.topbarBrand}>
          <div className={styles.brandBadge}>
            <Icon name="shield" size={16} color="#D2823C" />
          </div>
          <span className={styles.topbarBrandName}>Admin Console</span>
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
          <Link href="/admin" className={styles.brand}>
            <div className={styles.brandBadge}>
              <Icon name="shield" size={18} color="#D2823C" />
            </div>
            <span className={styles.brandName}>Admin Console</span>
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
          <Link href="/admin" className={styles.navItemActive}>
            <span className={styles.navIcon}>
              <Icon name="grid" size={18} />
            </span>
            Overview
          </Link>
        </nav>

        <div className={styles.spacer} />

        <div className={styles.profile}>
          <div className={styles.avatar}>{initials(adminName)}</div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>{adminName}</div>
            <form action={adminLogoutAction}>
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
