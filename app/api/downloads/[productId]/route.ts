import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

/** productId -> file on disk (outside /public, so it can only be reached through this gated route). */
const DIGITAL_FILES: Record<string, { file: string; downloadName: string; contentType: string }> = {
  "sfacl-ebook": {
    file: "songs-for-a-changing-life.pdf",
    downloadName: "Songs for a Changing Life.pdf",
    contentType: "application/pdf",
  },
  "argument-resolution-ebook": {
    file: "happily-ever-after-argument-resolution.pdf",
    downloadName: "Happily, Ever After - Argument Resolution.pdf",
    contentType: "application/pdf",
  },
};

export async function GET(_req: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;

  const product = getProduct(productId);
  const fileInfo = DIGITAL_FILES[productId];
  if (!product?.isDigital || !fileInfo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = await requireUser();

  const paidOrderItem = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId: user.id, paymentStatus: "paid" },
    },
  });

  if (!paidOrderItem) {
    return NextResponse.json({ error: "You don't have paid access to this item yet." }, { status: 403 });
  }

  const filePath = path.join(process.cwd(), "private", "ebooks", fileInfo.file);
  let buffer: Buffer;
  try {
    buffer = await readFile(filePath);
  } catch {
    return NextResponse.json({ error: "File is temporarily unavailable." }, { status: 500 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": fileInfo.contentType,
      "Content-Disposition": `attachment; filename="${fileInfo.downloadName}"`,
      "Content-Length": String(buffer.length),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
