"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export type PassportApplyState = { error: string } | null;

const applySchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  address: z.string().trim().min(4, "Enter your address.").max(300),
  country: z.string().trim().min(2, "Enter your country.").max(100),
  pictureUrl: z
    .string()
    .trim()
    .min(1, "Please upload a photo.")
    .refine((v) => v.startsWith("data:image/"), "Please upload a valid photo."),
});

export async function submitPassportApplicationAction(
  _prevState: PassportApplyState,
  formData: FormData,
): Promise<PassportApplyState> {
  const parsed = applySchema.safeParse({
    fullName: formData.get("fullName"),
    address: formData.get("address"),
    country: formData.get("country"),
    pictureUrl: formData.get("pictureUrl"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
  }

  const user = await requireUser();

  const existing = await prisma.passportApplication.findUnique({ where: { userId: user.id } });
  if (existing) {
    return { error: "You already have a passport application on file." };
  }

  await prisma.passportApplication.create({
    data: {
      userId: user.id,
      fullName: parsed.data.fullName,
      address: parsed.data.address,
      country: parsed.data.country,
      pictureUrl: parsed.data.pictureUrl,
    },
  });

  revalidatePath("/passport");
  redirect("/passport?submitted=1");
}
