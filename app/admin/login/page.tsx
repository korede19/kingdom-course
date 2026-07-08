import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionAdmin } from "@/lib/admin-session";
import { AdminLoginForm } from "./AdminLoginForm";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Admin Login · Kingdom Culture Academy" };

export default async function AdminLoginPage() {
  const admin = await getSessionAdmin();
  if (admin) redirect("/admin");

  return (
    <div className={styles.page}>
      <AdminLoginForm />
    </div>
  );
}
