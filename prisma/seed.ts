import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@kingdom.com";
const DEMO_PASSWORD = "demo1234";

async function seedDemoUser() {
  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (existing) {
    console.log(`Demo user already exists (${DEMO_EMAIL}), skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const user = await prisma.user.create({
    data: {
      name: "Friend",
      email: DEMO_EMAIL,
      passwordHash,
      progress: {
        create: Array.from({ length: 10 }, (_, i) => ({ lessonNum: i + 1 })),
      },
    },
  });

  console.log(`Seeded demo user ${user.email} (password: ${DEMO_PASSWORD})`);
}

async function seedSuperAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@kingdomcultureacademy.local").trim().toLowerCase();

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists (${email}), skipping.`);
    return;
  }

  const password = process.env.ADMIN_PASSWORD ?? randomBytes(9).toString("base64url");
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.create({
    data: { name: "Super Admin", email, passwordHash },
  });

  console.log(`Seeded admin ${admin.email} (password: ${password})`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log("  ^ generated password — save it now, it will not be shown again. Set ADMIN_EMAIL/ADMIN_PASSWORD env vars to control this instead.");
  }
}

async function main() {
  await seedDemoUser();
  await seedSuperAdmin();
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
