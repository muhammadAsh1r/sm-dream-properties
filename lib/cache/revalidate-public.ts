import { revalidatePath, revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache/tags";

/** Invalidate public-facing cached data after admin content changes. */
export function revalidatePublicContent(options?: {
  properties?: boolean;
  settings?: boolean;
  blog?: boolean;
  testimonials?: boolean;
  stats?: boolean;
  team?: boolean;
  layout?: boolean;
}) {
  const opts = {
    properties: true,
    settings: false,
    blog: false,
    testimonials: false,
    stats: true,
    team: false,
    layout: false,
    ...options,
  };

  if (opts.settings || opts.layout) {
    revalidateTag(CACHE_TAGS.settings);
    revalidatePath("/", "layout");
  }
  if (opts.properties) revalidateTag(CACHE_TAGS.properties);
  if (opts.blog) revalidateTag(CACHE_TAGS.blog);
  if (opts.testimonials) revalidateTag(CACHE_TAGS.testimonials);
  if (opts.stats) revalidateTag(CACHE_TAGS.stats);
  if (opts.team) revalidateTag(CACHE_TAGS.team);
}
