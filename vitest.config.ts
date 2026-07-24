import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      // Next's "only run on the server" guards throw when Vite resolves their `browser` field
      // (as it does by default in a test environment). Tests aren't a client bundle, so no-op them.
      "server-only": path.resolve(__dirname, "lib/__tests__/__stubs__/empty.ts"),
      "client-only": path.resolve(__dirname, "lib/__tests__/__stubs__/empty.ts"),
      "@": path.resolve(__dirname, "."),
    },
  },
});
