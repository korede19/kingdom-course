import "server-only";
import { randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ADMIN_SESSION_COOKIE as COOKIE_NAME } from "@/lib/constants";
import type { Admin } from "@prisma/client";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours — shorter-lived than user sessions

export async function createAdminSession(adminId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.adminSession.create({
    data: { id: token, adminId, expiresAt },
  });

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.adminSession.deleteMany({ where: { id: token } });
  }
  store.delete(COOKIE_NAME);
}

/** Reads the current admin session's Admin, if any. Does not redirect. Deduped per-request. */
export const getSessionAdmin = cache(async (): Promise<Admin | null> => {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { id: token },
    include: { admin: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.adminSession.delete({ where: { id: token } });
    return null;
  }

  return session.admin;
});

/** For use in protected admin layouts/pages/Server Actions: verifies the session and redirects if absent. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
