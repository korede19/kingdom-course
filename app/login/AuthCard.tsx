"use client";

import { useActionState, useState } from "react";
import { loginAction, registerAction, type AuthState } from "@/actions/auth";
import { Icon } from "@/components/Icon";
import styles from "./AuthCard.module.css";

type Mode = "login" | "register";

export function AuthCard() {
  const [mode, setMode] = useState<Mode>("login");
  const [loginState, loginFormAction, loginPending] = useActionState<AuthState, FormData>(loginAction, null);
  const [registerState, registerFormAction, registerPending] = useActionState<AuthState, FormData>(
    registerAction,
    null,
  );

  return (
    <div className={styles.card}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={mode === "login" ? styles.tabActive : styles.tabInactive}
          onClick={() => setMode("login")}
        >
          Log In
        </button>
        <button
          type="button"
          className={mode === "register" ? styles.tabActive : styles.tabInactive}
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>

      {mode === "login" ? (
        <form action={loginFormAction}>
          <h1 className={styles.heading}>Welcome back</h1>
          <p className={styles.subheading}>Continue your journey where you left off.</p>

          <label className={styles.label} htmlFor="login-email">
            Email
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Icon name="mail" size={16} color="#8FA69E" />
            </span>
            <input id="login-email" name="email" type="email" placeholder="you@example.com" className={styles.input} required />
          </div>

          <label className={styles.label} htmlFor="login-password">
            Password
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Icon name="lock" size={16} color="#8FA69E" />
            </span>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="••••••••"
              className={styles.input}
              required
            />
          </div>

          {loginState?.error ? <div className={styles.error}>{loginState.error}</div> : null}

          <button type="submit" className={styles.submit} disabled={loginPending}>
            {loginPending ? "Logging in…" : "Log In"}
          </button>

          <div className={styles.demoTip}>
            Demo tip: use <b>demo@kingdom.com</b> / <b>demo1234</b>
          </div>
        </form>
      ) : (
        <form action={registerFormAction}>
          <h1 className={styles.heading}>Create your account</h1>
          <p className={styles.subheading}>Begin your 10-week journey today.</p>

          <label className={styles.label} htmlFor="reg-name">
            Full Name
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Icon name="user" size={16} color="#8FA69E" />
            </span>
            <input id="reg-name" name="name" type="text" placeholder="Jordan Ade" className={styles.input} required />
          </div>

          <label className={styles.label} htmlFor="reg-email">
            Email
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Icon name="mail" size={16} color="#8FA69E" />
            </span>
            <input
              id="reg-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className={styles.input}
              required
            />
          </div>

          <label className={styles.label} htmlFor="reg-password">
            Password
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Icon name="lock" size={16} color="#8FA69E" />
            </span>
            <input
              id="reg-password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              className={styles.input}
              required
              minLength={6}
            />
          </div>

          {registerState?.error ? <div className={styles.error}>{registerState.error}</div> : null}

          <button type="submit" className={styles.submit} disabled={registerPending}>
            {registerPending ? "Creating account…" : "Create Account & Begin"}
          </button>
        </form>
      )}
    </div>
  );
}
