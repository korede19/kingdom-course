import { requireAdmin } from "@/lib/admin-session";
import { AdminSidebar } from "@/components/AdminSidebar";
import styles from "./layout.module.css";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className={styles.shell}>
      <AdminSidebar adminName={admin.name} />
      <div className={styles.content}>
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
}
