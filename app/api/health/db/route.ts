import {
  assertRuntimeDatabaseUrl,
  normalizeDatabaseUrl,
  parseDatabaseHost,
} from "@/lib/db/connection-string";
import { prisma } from "@/lib/prisma";

function formatHealthError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Database check failed";

  if (message.includes("EMAXCONNSESSION") || message.includes("max clients reached")) {
    return [
      "Supabase connection pool exhausted (session mode).",
      "Set DATABASE_URL to the Transaction pooler on port 6543 with ?pgbouncer=true.",
      "Use DIRECT_URL on port 5432 for migrations only — not for DATABASE_URL.",
    ].join(" ");
  }

  return message;
}

export async function GET() {
  try {
    assertRuntimeDatabaseUrl(process.env.DATABASE_URL);
    const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL);
    const host = parseDatabaseHost(connectionString);
    const port = new URL(connectionString).port || "5432";

    if (host === "base") {
      return Response.json(
        {
          ok: false,
          error: 'DATABASE_URL host is "base" — the connection string is truncated on Vercel.',
        },
        { status: 503 }
      );
    }

    await prisma.$queryRaw`SELECT 1`;
    const userCount = await prisma.user.count();

    return Response.json({
      ok: true,
      host,
      port,
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ ok: false, error: formatHealthError(error) }, { status: 503 });
  }
}
