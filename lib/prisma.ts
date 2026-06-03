import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

import { normalizeDatabaseUrl, parseDatabaseHost } from "@/lib/db/connection-string";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL);
  const hostname = parseDatabaseHost(connectionString);

  if (hostname === "base") {
    throw new Error(
      'DATABASE_URL host is "base" — the connection string is truncated. Use the full Supabase pooler URL ending in .supabase.com:6543/postgres?pgbouncer=true'
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

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
