import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  let hostname = "";
  try {
    hostname = new URL(connectionString).hostname;
  } catch {
    throw new Error(
      "DATABASE_URL is not a valid URL. Copy the full Supabase connection string (with %21 for ! in the password)."
    );
  }

  if (hostname === "base") {
    throw new Error(
      'DATABASE_URL host is "base" — the connection string is truncated or wrong. Use the full Supabase pooler URL ending in .supabase.com:6543/postgres?pgbouncer=true'
    );
  }

  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

  const adapter = new PrismaPg(pool);
  globalForPrisma.pool = pool;

  const logQueries = process.env.PRISMA_LOG_QUERIES === "true";

  return new PrismaClient({
    adapter,
    log: logQueries ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
