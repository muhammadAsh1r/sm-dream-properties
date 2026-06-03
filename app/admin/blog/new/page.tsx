import { getBlogCategories } from "@/features/admin/actions/content";
import { BlogForm } from "@/features/admin/components/blog/blog-form";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";
import { requirePermission } from "@/lib/auth";

export default async function NewBlogPostPage() {
  await requirePermission("blog:create");
  const categories = await getBlogCategories();

  return (
    <div>
      <AdminPageHeader title="New Blog Post" description="Write and publish a new article" />
      <BlogForm categories={categories} />
    </div>
  );
}
