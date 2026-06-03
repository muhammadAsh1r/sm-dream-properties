import type { PropertySearchParams } from "@/types/property";

export function buildSearchParams(params: PropertySearchParams): URLSearchParams {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  return search;
}
