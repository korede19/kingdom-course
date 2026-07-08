"use client";

import { useActionState } from "react";
import { adminLoginAction, type AdminAuthState } from "@/actions/admin-auth";
import { Icon } from "@/components/Icon";
import styles from "./AdminLoginForm.module.css";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState<AdminAuthState, FormData>(adminLoginAction, null);

  return (
    <div className={styles.card}>
      <div className={styles.badge}>
        <Icon name="shield" size={22} color="#F2C99B" />
      </div>
      <h1 className={styles.heading}>Admin Access</h1>
      <p className={styles.subheading}>Sign in with your administrator credentials.</p>

      <form action={formAction}>
        <label className={styles.label} htmlFor="admin-email">
          Email
        </label>
        <div className={styles.inputWrap}>
          <span className={styles.inputIcon}>
            <Icon name="mail" size={16} color="#8FA69E" />
          </span>
          <input id="admin-email" name="email" type="email" placeholder="admin@example.com" className={styles.input} required />
        </div>

        <label className={styles.label} htmlFor="admin-password">
          Password
        </label>
        <div className={styles.inputWrap}>
          <span className={styles.inputIcon}>
            <Icon name="lock" size={16} color="#8FA69E" />
          </span>
          <input
            id="admin-password"
            name="password"
            type="password"
            placeholder="••••••••"
            className={styles.input}
            required
          />
        </div>

        {state?.error ? <div className={styles.error}>{state.error}</div> : null}

        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
