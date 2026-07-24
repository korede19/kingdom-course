import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyCronSecret } from "@/lib/cronAuth";
import { sendProgressNudgeEmail } from "@/lib/email";
import { LESSON_COUNT } from "@/lib/constants";

export const dynamic = "force-dynamic";

const RENUDGE_AFTER_MS = 7 * 24 * 60 * 60 * 1000; // don't nudge the same person more than once a week
const STALE_AFTER_MS = 3 * 24 * 60 * 60 * 1000; // only nudge if their last activity was a few days ago

async function handleNudge(req: NextRequest): Promise<NextResponse> {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const renudgeCutoff = new Date(now.getTime() - RENUDGE_AFTER_MS);
  const staleCutoff = new Date(now.getTime() - STALE_AFTER_MS);

  const candidates = await prisma.user.findMany({
    where: {
      completionDate: null,
      OR: [{ lastNudgedAt: null }, { lastNudgedAt: { lt: renudgeCutoff } }],
    },
    include: { progress: true },
  });

  let nudged = 0;
  for (const user of candidates) {
    const completedCount = user.progress.filter((p) => p.quizPassed).length;
    if (completedCount === 0) continue; // hasn't started yet — a nudge here isn't useful

    const lastActivity = user.progress.reduce<Date | null>((latest, p) => {
      return !latest || p.updatedAt > latest ? p.updatedAt : latest;
    }, null);
    if (lastActivity && lastActivity > staleCutoff) continue; // still actively working through it

    const lessonsLeft = LESSON_COUNT - completedCount;
    try {
      await sendProgressNudgeEmail(user.email, user.name, lessonsLeft);
      await prisma.user.update({ where: { id: user.id }, data: { lastNudgedAt: now } });
      nudged++;
    } catch (err) {
      console.error(`[Cron/nudge] Failed to nudge ${user.email}:`, err);
    }
  }

  return NextResponse.json({ checked: candidates.length, nudged });
}

export async function GET(req: NextRequest) {
  return handleNudge(req);
}

export async function POST(req: NextRequest) {
  return handleNudge(req);
}
