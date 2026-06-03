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
