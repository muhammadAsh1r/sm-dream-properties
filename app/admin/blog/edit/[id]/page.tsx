import { notFound } from "next/navigation";

import { getBlogCategories, getBlogPost } from "@/features/admin/actions/content";
import { BlogForm } from "@/features/admin/components/blog/blog-form";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getBlogPost(id),
    getBlogCategories(),
  ]);

  if (!post) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Post" description={post.title} />
      <BlogForm post={post} categories={categories} />
    </div>
  );
}
