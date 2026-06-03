import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Calendar, User } from "lucide-react";
import type { BlogPost, Category, User as DbUser } from "@prisma/client";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/design-system/typography";
import { FadeUp } from "@/components/motion/fade-up";
import { Badge } from "@/components/ui/badge";

type BlogPostRow = BlogPost & {
  category: Pick<Category, "name" | "slug"> | null;
  author: Pick<DbUser, "name"> | null;
};

type BlogListingContentProps = {
  posts: BlogPostRow[];
};

function BlogCard({ post }: { post: BlogPostRow }) {
  const date = post.publishedAt ?? post.createdAt;

  return (
    <FadeUp>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <Link href={`/blog/${post.slug}`} className="relative block">
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary text-sm text-white/50">
                SM Dream Blog
              </div>
            )}
            {post.category && (
              <div className="absolute top-4 left-4">
                <Badge variant="featured">{post.category.name}</Badge>
              </div>
            )}
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5" />
              {format(date, "dd MMM yyyy")}
            </span>
            {post.author?.name && (
              <span className="inline-flex items-center gap-1">
                <User className="size-3.5" />
                {post.author.name}
              </span>
            )}
          </div>

          <Link href={`/blog/${post.slug}`}>
            <Typography as="h2" variant="h4" className="transition-colors group-hover:text-primary">
              {post.title}
            </Typography>
          </Link>

          {post.excerpt && (
            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}

          <Link
            href={`/blog/${post.slug}`}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Read article
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
    </FadeUp>
  );
}

export function BlogListingContent({ posts }: BlogListingContentProps) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-secondary py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgb(0_200_255_/_0.12),transparent)]" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Typography variant="eyebrow" className="text-brand-accent">
              Insights & Updates
            </Typography>
            <Typography as="h1" variant="h1" className="mt-4 text-white">
              SM Dream Blog
            </Typography>
            <Typography variant="bodyLarge" className="mt-4 text-white/70">
              Market insights, investment tips, and property news from Islamabad&apos;s
              trusted real estate advisors.
            </Typography>
          </div>
        </Container>
      </section>

      <Section spacing="md">
        <Container>
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-20 text-center">
              <Typography as="h2" variant="h3" className="mb-2">
                No articles yet
              </Typography>
              <Typography variant="small">
                Check back soon for property insights and market updates.
              </Typography>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
