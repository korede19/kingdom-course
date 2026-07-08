/** Fixed course shape — safe to import from client components (no server-only data). */
export const LESSON_COUNT = 10;
export const LESSON_NUMS = Array.from({ length: LESSON_COUNT }, (_, i) => i + 1);

/** Shared with proxy.ts (edge runtime, can't import lib/session.ts's Prisma dependency). */
export const SESSION_COOKIE = "kca_session";

/** Separate cookie for the admin credential system — never overlaps with SESSION_COOKIE. */
export const ADMIN_SESSION_COOKIE = "kca_admin_session";
