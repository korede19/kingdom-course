import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { AuthHero } from "@/app/login/AuthHero";
import { ResetPasswordForm } from "./ResetPasswordForm";
import styles from "../login/page.module.css";

export const metadata: Metadata = { title: "Reset Password · Kingdom Culture Academy" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  const { token } = await searchParams;

  return (
    <div className={styles.page}>
      <AuthHero />
      <div className={styles.formSide}>
        <ResetPasswordForm token={token ?? ""} />
      </div>
    </div>
  );
}
