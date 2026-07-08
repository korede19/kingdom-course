"use client";

import { useActionState, useState } from "react";
import { adminLoginAction, type AdminAuthState } from "@/actions/admin-auth";
import { Icon } from "@/components/Icon";
import styles from "./AdminLoginForm.module.css";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState<AdminAuthState, FormData>(adminLoginAction, null);
  const [showPassword, setShowPassword] = useState(false);

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
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`${styles.input} ${styles.inputWithToggle}`}
            required
          />
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            <Icon name={showPassword ? "eyeOff" : "eye"} size={17} color="#8FA69E" />
          </button>
        </div>

        {state?.error ? <div className={styles.error}>{state.error}</div> : null}

        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
