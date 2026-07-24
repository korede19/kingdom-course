import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page Not Found · Kingdom Culture Academy" };

export default function NotFound() {
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
            fontFamily: "var(--font-display)",
            fontSize: 56,
            fontWeight: 800,
            color: "var(--color-gold-deep)",
            lineHeight: 1,
            marginBottom: 14,
          }}
        >
          404
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--color-green)", margin: "0 0 10px" }}>
          This territory isn&apos;t mapped
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: 15, lineHeight: 1.6, margin: "0 0 28px" }}>
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            padding: "14px 26px",
            border: "none",
            borderRadius: 10,
            background: "var(--color-green)",
            color: "var(--color-gold)",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
