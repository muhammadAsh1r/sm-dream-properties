import type { Metadata } from "next";

import { getPublicSiteConfig } from "@/features/content/queries/public";
import { BlogListingContent } from "@/features/blog/components/blog-listing-content";
import { getPublishedBlogPosts } from "@/features/blog/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteConfig();
  return {
    title: "Blog",
    description: `Property insights, market updates, and investment tips from ${site.name}.`,
    openGraph: {
      title: `Blog | ${site.name}`,
      description: site.description,
      url: `${site.url}/blog`,
    },
    alternates: {
      canonical: `${site.url}/blog`,
    },
  };
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  return <BlogListingContent posts={posts} />;
}
