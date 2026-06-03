import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublicSiteConfig } from "@/features/content/queries/public";
import { BlogPostContent } from "@/features/blog/components/blog-post-content";
import { getPublishedBlogPostBySlug } from "@/features/blog/queries/public";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post, site] = await Promise.all([
    getPublishedBlogPostBySlug(slug),
    getPublicSiteConfig(),
  ]);

  if (!post) {
    return { title: "Article Not Found" };
  }

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt ?? site.description;
  const url = post.canonicalUrl ?? `${site.url}/blog/${post.slug}`;
  const image = post.ogImage ?? post.featuredImage ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: image ? [{ url: image }] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) notFound();

  return <BlogPostContent post={post} />;
}
