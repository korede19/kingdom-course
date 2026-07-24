import "server-only";
import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Kingdom Culture Academy <onboarding@resend.dev>";
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://kingdomcultureacademy.com").replace(/\/$/, "");

let client: Resend | null | undefined;

/** Lazily constructed so builds/tests without RESEND_API_KEY don't crash at import time. */
function getClient(): Resend | null {
  if (client !== undefined) return client;
  const apiKey = process.env.RESEND_API_KEY;
  client = apiKey ? new Resend(apiKey) : null;
  if (!client) {
    console.warn("[Email] RESEND_API_KEY is not set — emails will be logged instead of sent.");
  }
  return client;
}

function wrapper(bodyHtml: string): string {
  return `
<div style="background:#faf7ef;padding:32px 16px;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:0 auto;background:#fffcf3;border:1px solid #ede3c4;border-radius:16px;overflow:hidden;">
    <div style="background:#123b36;padding:24px 32px;text-align:center;">
      <div style="color:#f2c99b;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;">Kingdom Culture Academy</div>
    </div>
    <div style="padding:32px;color:#20242f;font-size:15px;line-height:1.7;">
      ${bodyHtml}
    </div>
    <div style="padding:20px 32px;border-top:1px solid #ede3c4;color:#9c9280;font-size:12px;text-align:center;">
      Kingdom Culture Academy · <a href="${APP_URL}" style="color:#a85f1e;">${APP_URL.replace(/^https?:\/\//, "")}</a>
    </div>
  </div>
</div>`.trim();
}

function button(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;margin:18px 0;padding:14px 26px;border-radius:10px;background:#123b36;color:#f2c99b;font-weight:bold;text-decoration:none;">${label}</a>`;
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const resend = getClient();
  if (!resend) {
    console.info(`[Email] (not sent — no API key) To: ${to} | Subject: ${subject}`);
    return;
  }
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  if (error) {
    console.error(`[Email] Failed to send "${subject}" to ${to}:`, error);
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const html = wrapper(`
    <h1 style="color:#123b36;font-size:22px;margin:0 0 12px;">Welcome, ${name} 👋</h1>
    <p>Your account is ready. Lesson 1 is waiting for you — <em>The Original Mandate</em>.</p>
    <p>Over the next 10 weeks you'll unlearn the culture of the kingdom of earth and be formed into a citizen and ambassador of the Kingdom of Heaven.</p>
    ${button("Start Lesson 1", `${APP_URL}/course/1`)}
    <p style="color:#7c7157;font-size:13.5px;">You can pick up where you left off any time from your dashboard.</p>
  `);
  await sendEmail(email, "Welcome to Kingdom Culture Academy", html);
}

export async function sendPasswordResetEmail(email: string, name: string, resetUrl: string): Promise<void> {
  const html = wrapper(`
    <h1 style="color:#123b36;font-size:22px;margin:0 0 12px;">Reset your password</h1>
    <p>Hi ${name}, we received a request to reset your password. This link expires in 1 hour.</p>
    ${button("Reset Password", resetUrl)}
    <p style="color:#7c7157;font-size:13.5px;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
  `);
  await sendEmail(email, "Reset your password · Kingdom Culture Academy", html);
}

export async function sendCourseCompletionEmail(email: string, name: string): Promise<void> {
  const html = wrapper(`
    <h1 style="color:#123b36;font-size:22px;margin:0 0 12px;">Congratulations, ${name} 🎉</h1>
    <p>You've completed all 10 lessons of Kingdom Culture Academy. You are now recognized as a formed citizen and ambassador of the Kingdom of Heaven.</p>
    <p>Your Certificate of Completion is ready.</p>
    ${button("View Your Certificate", `${APP_URL}/certificate`)}
  `);
  await sendEmail(email, "You completed Kingdom Culture Academy 🎉", html);
}

export async function sendProgressNudgeEmail(email: string, name: string, lessonsLeft: number): Promise<void> {
  const html = wrapper(`
    <h1 style="color:#123b36;font-size:22px;margin:0 0 12px;">Still with us, ${name}?</h1>
    <p>You're just ${lessonsLeft} lesson${lessonsLeft === 1 ? "" : "s"} away from your Certificate of Completion.</p>
    ${button("Continue Your Journey", `${APP_URL}/course`)}
  `);
  await sendEmail(email, `${lessonsLeft} lesson${lessonsLeft === 1 ? "" : "s"} left to your certificate`, html);
}
