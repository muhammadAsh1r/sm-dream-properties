export function normalizeDatabaseUrl(raw?: string): string {
  if (!raw?.trim()) {
    throw new Error("DATABASE_URL is not set");
  }

  let url = raw.trim();

  // Common when pasting into Vercel with quotes included in the value
  while (
    (url.startsWith('"') && url.endsWith('"')) ||
    (url.startsWith("'") && url.endsWith("'"))
  ) {
    url = url.slice(1, -1).trim();
  }

  return url;
}

export function parseDatabaseHost(connectionString: string): string {
  try {
    return new URL(connectionString).hostname;
  } catch {
    throw new Error(
      "DATABASE_URL is not a valid URL. Paste the full Supabase string on one line, with %21 for ! in the password, and no surrounding quotes."
    );
  }
}

function isLocalDatabaseHost(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1";
}

function isSupabasePoolerHost(host: string): boolean {
  return host.endsWith(".pooler.supabase.com");
}

/** Runtime DATABASE_URL must use Supabase transaction pooler (6543), not session pooler (5432). */
export function assertRuntimeDatabaseUrl(raw?: string): void {
  const normalized = normalizeDatabaseUrl(raw);
  const url = new URL(normalized);
  const port = url.port || "5432";

  if (isSupabasePoolerHost(url.hostname) && port === "5432") {
    throw new Error(
      "DATABASE_URL is using Supabase session pooler (port 5432). On Vercel set DATABASE_URL to the Transaction pooler (port 6543) with ?pgbouncer=true. Reserve port 5432 for DIRECT_URL (migrations only)."
    );
  }

  if (isSupabasePoolerHost(url.hostname) && port === "6543" && !url.searchParams.has("pgbouncer")) {
    throw new Error(
      'DATABASE_URL must include ?pgbouncer=true when using Supabase transaction pooler (port 6543).'
    );
  }
}

function getPoolMaxConnections(): number {
  // One connection per serverless instance — avoids exhausting Supabase pool limits.
  if (process.env.VERCEL) return 1;
  return 10;
}

function stripSslModeParam(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    // pg v8+ maps sslmode=require to verify-full, which breaks Supabase on Vercel.
    // TLS is enabled via the Pool `ssl` option instead.
    url.searchParams.delete("sslmode");
    return url.toString();
  } catch {
    return connectionString;
  }
}

/** Pool options for `pg` — Vercel/Supabase need explicit TLS trust. */
export function getPgPoolConfig(rawUrl?: string) {
  assertRuntimeDatabaseUrl(rawUrl);
  const normalized = normalizeDatabaseUrl(rawUrl);
  const host = parseDatabaseHost(normalized);
  const connectionString = isLocalDatabaseHost(host)
    ? normalized
    : stripSslModeParam(normalized);

  return {
    connectionString,
    max: getPoolMaxConnections(),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ...(isLocalDatabaseHost(host)
      ? {}
      : { ssl: { rejectUnauthorized: false } }),
  };
}
