import { normalizeDatabaseUrl, parseDatabaseHost } from "@/lib/db/connection-string";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL);
    const host = parseDatabaseHost(connectionString);

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
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database check failed";
    return Response.json({ ok: false, error: message }, { status: 503 });
  }
}
