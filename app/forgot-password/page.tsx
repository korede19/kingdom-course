import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { AuthHero } from "@/app/login/AuthHero";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import styles from "../login/page.module.css";

export const metadata: Metadata = { title: "Forgot Password · Kingdom Culture Academy" };

export default async function ForgotPasswordPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <div className={styles.page}>
      <AuthHero />
      <div className={styles.formSide}>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
