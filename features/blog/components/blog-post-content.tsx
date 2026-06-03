import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { ArrowLeft, Calendar, User } from "lucide-react";
import type { BlogPost, Category, User as DbUser } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/design-system/typography";
import { FadeUp } from "@/components/motion/fade-up";

const BlogContent = dynamic(
  () => import("@/features/blog/components/blog-content").then((m) => m.BlogContent),
  {
    loading: () => (
      <div className="space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
      </div>
    ),
  }
);

type BlogPostRow = BlogPost & {
  category: Pick<Category, "name" | "slug"> | null;
  author: Pick<DbUser, "name"> | null;
};

type BlogPostContentProps = {
  post: BlogPostRow;
};

export function BlogPostContent({ post }: BlogPostContentProps) {
  const date = post.publishedAt ?? post.createdAt;
  const content = post.content as object;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-secondary py-12 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgb(0_200_255_/_0.1),transparent)]" />
        <Container className="relative">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Blog
          </Link>

          <div className="mx-auto max-w-3xl">
            {post.category && (
              <Badge variant="featured" className="mb-4">
                {post.category.name}
              </Badge>
            )}
            <Typography as="h1" variant="h1" className="text-white">
              {post.title}
            </Typography>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4" />
                {format(date, "dd MMMM yyyy")}
              </span>
              {post.author?.name && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="size-4" />
                  {post.author.name}
                </span>
              )}
            </div>
          </div>
        </Container>
      </section>

      {post.featuredImage && (
        <Section spacing="sm" className="pb-0">
          <Container>
            <FadeUp>
              <div className="relative mx-auto aspect-[21/9] max-w-4xl overflow-hidden rounded-2xl border border-border/80 shadow-lg">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            </FadeUp>
          </Container>
        </Section>
      )}

      <Section spacing="md">
        <Container>
          <FadeUp>
            <article className="mx-auto max-w-3xl">
              {post.excerpt && (
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
              <BlogContent content={content} />
            </article>
          </FadeUp>
        </Container>
      </Section>
    </>
  );
}
