import { unstable_cache } from "next/cache";
import { cache as reactCache } from "react";

import { CACHE_TAGS } from "@/lib/cache/tags";
import { prisma } from "@/lib/prisma";

export const getPublishedBlogPosts = unstable_cache(
  async () => {
    return prisma.blogPost.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
      },
    });
  },
  ["published-blog-posts"],
  { revalidate: 120, tags: [CACHE_TAGS.blog] }
);

async function fetchBlogPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, published: true },
    include: {
      category: { select: { name: true, slug: true } },
      author: { select: { name: true } },
    },
  });
}

export const getPublishedBlogPostBySlug = reactCache(async (slug: string) => {
  return unstable_cache(
    () => fetchBlogPostBySlug(slug),
    [`blog-slug-${slug}`],
    { revalidate: 120, tags: [CACHE_TAGS.blog] }
  )();
});

export async function getPublishedBlogSlugs(): Promise<string[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((p) => p.slug);
}
