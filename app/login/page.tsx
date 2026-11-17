import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { AuthHero } from "./AuthHero";
import { AuthCard } from "./AuthCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Log In · Kingdom Culture Academy",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string; mode?: string }>;
}) {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  const { reset, mode } = await searchParams;

  return (
    <div className={styles.page}>
      <AuthHero />
      <div className={styles.formSide}>
        <AuthCard resetSuccess={reset === "success"} initialMode={mode === "register" ? "register" : "login"} />
      </div>
    </div>
  );
}
