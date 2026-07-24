"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction, type ResetRequestState } from "@/actions/password-reset";
import { Icon } from "@/components/Icon";
import styles from "../login/AuthCard.module.css";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<ResetRequestState, FormData>(
    requestPasswordResetAction,
    null,
  );

  return (
    <div className={styles.card}>
      {state?.message && !state.error ? (
        <>
          <h1 className={styles.heading}>Check your email</h1>
          <p className={styles.subheading}>{state.message}</p>
          <Link href="/login" className={styles.submit} style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
            Back to Log In
          </Link>
        </>
      ) : (
        <form action={formAction}>
          <h1 className={styles.heading}>Forgot your password?</h1>
          <p className={styles.subheading}>Enter your email and we&apos;ll send you a reset link.</p>

          <label className={styles.label} htmlFor="fp-email">
            Email
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Icon name="mail" size={16} color="#8FA69E" />
            </span>
            <input
              id="fp-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className={styles.input}
              required
            />
          </div>

          {state?.error ? <div className={styles.error}>{state.message}</div> : null}

          <button type="submit" className={styles.submit} disabled={pending}>
            {pending ? "Sending…" : "Send Reset Link"}
          </button>

          <p className={styles.legalNote}>
            <Link href="/login">Back to Log In</Link>
          </p>
        </form>
      )}
    </div>
  );
}
