"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Kingdom Culture Academy] Root-level error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", background: "#faf7ef" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            style={{
              maxWidth: 440,
              width: "100%",
              textAlign: "center",
              background: "#fffcf3",
              border: "1px solid #ede3c4",
              borderRadius: 24,
              padding: "48px 32px",
              boxShadow: "0 10px 26px rgba(20, 15, 5, 0.06)",
            }}
          >
            <h1 style={{ fontSize: 22, color: "#123b36", margin: "0 0 10px" }}>Something went wrong</h1>
            <p style={{ color: "#7c7157", fontSize: 15, lineHeight: 1.6, margin: "0 0 28px" }}>
              The app hit an unexpected error while loading. Please try again.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "14px 26px",
                border: "none",
                borderRadius: 10,
                background: "#123b36",
                color: "#f2c99b",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
