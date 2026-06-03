import type { PropertySearchParams } from "@/types/property";

export { buildSearchParams } from "./search-params";
export {
  getFeaturedPublishedProperties,
  getPublishedPropertyBySlug,
  getPublishedPropertySlugs,
  getSimilarPublishedProperties,
  searchPublishedProperties,
} from "../queries/public";

/** @deprecated Use searchPublishedProperties (async) */
export async function searchProperties(params: PropertySearchParams = {}) {
  const { searchPublishedProperties } = await import("../queries/public");
  return searchPublishedProperties(params);
}

/** @deprecated Use getSimilarPublishedProperties (async) */
export async function getSimilarProperties(
  property: import("@/types/property").Property,
  limit = 4
) {
  const { getSimilarPublishedProperties } = await import("../queries/public");
  return getSimilarPublishedProperties(property, limit);
}
