"use server";

import { revalidatePath } from "next/cache";

import { blogPostSchema, testimonialSchema } from "@/features/admin/schemas";
import { logActivity, requirePermission } from "@/lib/auth";
import { revalidatePublicContent } from "@/lib/cache/revalidate-public";
import { prisma } from "@/lib/prisma";

// ─── Blog ────────────────────────────────────────────────────────────────────

export async function getAdminBlogPosts(search?: string, published?: string) {
  await requirePermission("blog:view");
  return prisma.blogPost.findMany({
    where: {
      ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
      ...(published === "true" ? { published: true } : {}),
      ...(published === "false" ? { published: false } : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { category: true, author: { select: { name: true } } },
  });
}

export async function getBlogPost(id: string) {
  await requirePermission("blog:view");
  return prisma.blogPost.findUnique({ where: { id }, include: { category: true } });
}

export async function createBlogPost(input: unknown) {
  const user = await requirePermission("blog:create");
  const data = blogPostSchema.parse(input);

  const post = await prisma.blogPost.create({
    data: {
      ...data,
      content: data.content as object,
      publishedAt: data.published ? new Date() : null,
      authorId: user.id,
    },
  });

  await logActivity({
    userId: user.id,
    action: data.published ? "BLOG_PUBLISHED" : "BLOG_CREATED",
    entityType: "BlogPost",
    entityId: post.id,
    metadata: { title: post.title },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePublicContent({ blog: true, stats: true });
  if (post.published) revalidatePath(`/blog/${post.slug}`);
  return post;
}

export async function updateBlogPost(id: string, input: unknown) {
  const user = await requirePermission("blog:edit");
  const data = blogPostSchema.parse(input);

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      content: data.content as object,
      publishedAt:
        data.published && !existing?.publishedAt ? new Date() : existing?.publishedAt,
    },
  });

  await logActivity({
    userId: user.id,
    action: data.published ? "BLOG_PUBLISHED" : "BLOG_UPDATED",
    entityType: "BlogPost",
    entityId: post.id,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePublicContent({ blog: true });
  revalidatePath(`/blog/${post.slug}`);
  if (existing?.slug && existing.slug !== post.slug) {
    revalidatePath(`/blog/${existing.slug}`);
  }
  return post;
}

export async function deleteBlogPost(id: string) {
  const user = await requirePermission("blog:delete");
  const existing = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } });
  await prisma.blogPost.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "BLOG_DELETED", entityType: "BlogPost", entityId: id });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePublicContent({ blog: true });
  if (existing?.slug) revalidatePath(`/blog/${existing.slug}`);
}

export async function getBlogCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function createBlogCategory(name: string, slug: string) {
  const user = await requirePermission("blog:edit");
  const category = await prisma.category.create({ data: { name, slug } });

  await logActivity({
    userId: user.id,
    action: "CATEGORY_CREATED",
    entityType: "Category",
    entityId: category.id,
    metadata: { title: name },
  });

  revalidatePath("/admin/blog");
  return category;
}

export async function deleteBlogCategory(id: string) {
  const user = await requirePermission("blog:edit");
  await prisma.category.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: "CATEGORY_DELETED",
    entityType: "Category",
    entityId: id,
  });

  revalidatePath("/admin/blog");
}

// ─── Testimonials ────────────────────────────────────────────────────────────

export async function getAdminTestimonials() {
  await requirePermission("testimonials:view");
  return prisma.testimonial.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
}

export async function getTestimonial(id: string) {
  await requirePermission("testimonials:view");
  return prisma.testimonial.findUnique({ where: { id } });
}

export async function upsertTestimonial(id: string | null, input: unknown) {
  const user = await requirePermission("testimonials:edit");
  const data = testimonialSchema.parse(input);

  const testimonial = id
    ? await prisma.testimonial.update({ where: { id }, data })
    : await prisma.testimonial.create({ data });

  await logActivity({
    userId: user.id,
    action: id ? "TESTIMONIAL_UPDATED" : "TESTIMONIAL_CREATED",
    entityType: "Testimonial",
    entityId: testimonial.id,
  });

  revalidatePath("/admin/testimonials");
  revalidatePublicContent({ testimonials: true, stats: true });
  return testimonial;
}

export async function deleteTestimonial(id: string) {
  const user = await requirePermission("testimonials:edit");
  await prisma.testimonial.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "TESTIMONIAL_DELETED", entityType: "Testimonial", entityId: id });
  revalidatePath("/admin/testimonials");
  revalidatePublicContent({ testimonials: true, stats: true });
}

export async function toggleTestimonialApproval(id: string) {
  const user = await requirePermission("testimonials:edit");
  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");
  const updated = await prisma.testimonial.update({ where: { id }, data: { approved: !existing.approved } });
  revalidatePublicContent({ testimonials: true, stats: true });
  return updated;
}
