import { PrismaClient } from "@prisma/client";

/** Prisma error codes for transient connection failures worth retrying (not query/data errors). */
const RETRYABLE_CODES = new Set(["P1001", "P1002", "P1008", "P1017"]);
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 250;

function isRetryable(err: unknown): boolean {
  const code = (err as { code?: string } | null)?.code;
  return typeof code === "string" && RETRYABLE_CODES.has(code);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function basePrismaClient(): PrismaClient {
  return new PrismaClient().$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        let attempt = 0;
        for (;;) {
          try {
            return await query(args);
          } catch (err) {
            if (attempt >= MAX_RETRIES - 1 || !isRetryable(err)) throw err;
            attempt++;
            const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
            console.warn(
              `[DB] Transient error on ${model ?? ""}.${operation}, retrying in ${delay}ms (attempt ${attempt}/${MAX_RETRIES - 1})`,
            );
            await sleep(delay);
          }
        }
      },
    },
  }) as unknown as PrismaClient;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? basePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
