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
  const normalized = normalizeDatabaseUrl(rawUrl);
  const host = parseDatabaseHost(normalized);
  const connectionString = isLocalDatabaseHost(host)
    ? normalized
    : stripSslModeParam(normalized);

  return {
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ...(isLocalDatabaseHost(host)
      ? {}
      : { ssl: { rejectUnauthorized: false } }),
  };
}
