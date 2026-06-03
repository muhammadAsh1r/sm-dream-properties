import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { getAdminBlogPosts, getBlogCategories } from "@/features/admin/actions/content";
import { BlogTable } from "@/features/admin/components/blog/blog-table";
import { CategoryManager } from "@/features/admin/components/blog/category-manager";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";
import { AdminSearchBar } from "@/features/admin/components/shared/admin-search-bar";
import { Button } from "@/components/ui/button";

type PageProps = {
  searchParams: Promise<{ q?: string; published?: string }>;
};

export default async function AdminBlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [posts, categories] = await Promise.all([
    getAdminBlogPosts(params.q, params.published),
    getBlogCategories(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Create and publish blog posts"
        actions={
          <Button
            render={<Link href="/admin/blog/new" />}
            className="bg-primary font-semibold text-secondary hover:bg-primary/90"
          >
            <Plus className="size-4" />
            New Post
          </Button>
        }
      />

      <div className="mb-6">
        <Suspense>
          <AdminSearchBar
            placeholder="Search posts..."
            filters={[
              {
                key: "published",
                label: "All Status",
                options: [
                  { label: "Published", value: "true" },
                  { label: "Draft", value: "false" },
                ],
              },
            ]}
          />
        </Suspense>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <BlogTable posts={posts} />
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
