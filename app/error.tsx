"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Kingdom Culture Academy] Unhandled error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--color-bg)",
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          padding: "48px 32px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#f3e0da",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 22px",
            fontSize: 28,
          }}
        >
          ⚠️
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--color-green)", margin: "0 0 10px" }}>
          Something went wrong
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: 15, lineHeight: 1.6, margin: "0 0 28px" }}>
          We hit an unexpected snag loading this page. It&apos;s not you — try again, or head back to your
          dashboard.
        </p>
        <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "14px 26px",
              border: "none",
              borderRadius: 10,
              background: "var(--color-green)",
              color: "var(--color-gold)",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            style={{
              padding: "14px 26px",
              border: "1.5px solid var(--color-border-strong)",
              borderRadius: 10,
              color: "var(--color-text-muted)",
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
