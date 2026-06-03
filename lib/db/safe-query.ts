export async function withDbFallback<T>(
  query: () => Promise<T>,
  fallback: T,
  label = "query"
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.warn(`[db] ${label} failed, using fallback.`, error);
    return fallback;
  }
}
