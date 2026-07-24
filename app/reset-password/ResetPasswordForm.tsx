"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { resetPasswordAction, type ResetPasswordState } from "@/actions/password-reset";
import { Icon } from "@/components/Icon";
import styles from "../login/AuthCard.module.css";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ResetPasswordState, FormData>(resetPasswordAction, null);
  const [showPassword, setShowPassword] = useState(false);

  if (!token) {
    return (
      <div className={styles.card}>
        <h1 className={styles.heading}>Invalid link</h1>
        <p className={styles.subheading}>This password reset link is missing its token.</p>
        <Link href="/forgot-password" className={styles.submit} style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          Request a New Link
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <form action={formAction}>
        <h1 className={styles.heading}>Set a new password</h1>
        <p className={styles.subheading}>Choose a new password for your account.</p>

        <input type="hidden" name="token" value={token} />

        <label className={styles.label} htmlFor="rp-password">
          New Password
        </label>
        <div className={styles.inputWrap}>
          <span className={styles.inputIcon}>
            <Icon name="lock" size={16} color="#8FA69E" />
          </span>
          <input
            id="rp-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            className={`${styles.input} ${styles.inputWithToggle}`}
            required
            minLength={6}
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

        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}
