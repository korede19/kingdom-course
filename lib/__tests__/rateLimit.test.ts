import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rateLimit";

// Each test uses a unique key since checkRateLimit shares module-level state across calls.
function uniqueKey(name: string): string {
  return `${name}:${Math.random()}`;
}

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const key = uniqueKey("under-limit");
    const result = checkRateLimit(key, 3, 60_000);
    expect(result.ok).toBe(true);
  });

  it("allows exactly `limit` requests, then blocks the next one", () => {
    const key = uniqueKey("exact-limit");
    expect(checkRateLimit(key, 2, 60_000).ok).toBe(true);
    expect(checkRateLimit(key, 2, 60_000).ok).toBe(true);
    const third = checkRateLimit(key, 2, 60_000);
    expect(third.ok).toBe(false);
  });

  it("reports a positive retryAfterSeconds once blocked", () => {
    const key = uniqueKey("retry-after");
    checkRateLimit(key, 1, 60_000);
    const blocked = checkRateLimit(key, 1, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks separate keys independently", () => {
    const keyA = uniqueKey("a");
    const keyB = uniqueKey("b");
    checkRateLimit(keyA, 1, 60_000);
    const blockedA = checkRateLimit(keyA, 1, 60_000);
    const allowedB = checkRateLimit(keyB, 1, 60_000);
    expect(blockedA.ok).toBe(false);
    expect(allowedB.ok).toBe(true);
  });

  it("resets after the window expires", async () => {
    const key = uniqueKey("window-reset");
    checkRateLimit(key, 1, 30); // 30ms window
    expect(checkRateLimit(key, 1, 30).ok).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(checkRateLimit(key, 1, 30).ok).toBe(true);
  });
});
