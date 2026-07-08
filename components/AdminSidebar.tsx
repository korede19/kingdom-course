"use client";

import Link from "next/link";
import { adminLogoutAction } from "@/actions/admin-auth";
import { Icon } from "@/components/Icon";
import { initials } from "@/lib/format";
import styles from "./AdminSidebar.module.css";

export function AdminSidebar({ adminName }: { adminName: string }) {
  return (
    <aside className={styles.sidebar}>
      <Link href="/admin" className={styles.brand}>
        <div className={styles.brandBadge}>
          <Icon name="shield" size={18} color="#D2823C" />
        </div>
        <span className={styles.brandName}>Admin Console</span>
      </Link>

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
  );
}
