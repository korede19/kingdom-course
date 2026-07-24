"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { sendPasswordResetEmail } from "@/lib/email";
import { generateRawToken, hashToken } from "@/lib/tokens";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export type ResetRequestState = { message: string; error?: boolean } | null;

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const REQUEST_LIMIT = 4;
const REQUEST_WINDOW_MS = 15 * 60 * 1000;

const emailSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
});

const GENERIC_SENT_MESSAGE = "If an account exists for that email, we've sent a password reset link.";

export async function requestPasswordResetAction(
  _prevState: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: true, message: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
  }

  const ip = await getClientIp();
  const rate = checkRateLimit(`reset-request:${ip}`, REQUEST_LIMIT, REQUEST_WINDOW_MS);
  if (!rate.ok) {
    return { error: true, message: "Too many requests. Please try again later." };
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return the same message whether or not the account exists, to avoid leaking which emails are registered.
  if (!user) {
    return { message: GENERIC_SENT_MESSAGE };
  }

  const rawToken = generateRawToken();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://kingdomcultureacademy.com").replace(/\/$/, "");
  const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;
  sendPasswordResetEmail(user.email, user.name, resetUrl).catch((err: unknown) =>
    console.error("[PasswordReset] Failed to send reset email:", err),
  );

  return { message: GENERIC_SENT_MESSAGE };
}

export type ResetPasswordState = { error: string } | null;

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, "Password should be at least 6 characters."),
});

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const { token, password } = parsed.data;
  const tokenHash = hashToken(token);

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { error: "This reset link is invalid or has expired. Please request a new one." };
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    // Log out everywhere for safety once the password has changed.
    prisma.session.deleteMany({ where: { userId: resetToken.userId } }),
  ]);

  redirect("/login?reset=success");
}
