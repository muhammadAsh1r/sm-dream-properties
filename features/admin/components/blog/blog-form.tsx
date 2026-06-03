"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { BlogPost, Category } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/features/admin/components/blog/rich-text-editor";
import { createBlogPost, updateBlogPost } from "@/features/admin/actions/content";
import { blogPostSchema, type BlogPostFormValues } from "@/features/admin/schemas";

type BlogFormProps = {
  post?: BlogPost;
  categories: Category[];
};

const selectClass =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

export function BlogForm({ post, categories }: BlogFormProps) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const [content, setContent] = useState<object>(
    (post?.content as object) ?? { type: "doc", content: [{ type: "paragraph" }] }
  );

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema) as Resolver<BlogPostFormValues>,
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? {},
      featuredImage: post?.featuredImage ?? "",
      published: post?.published ?? false,
      seoTitle: post?.seoTitle ?? "",
      seoDescription: post?.seoDescription ?? "",
      ogImage: post?.ogImage ?? "",
      canonicalUrl: post?.canonicalUrl ?? "",
      categoryId: post?.categoryId ?? "",
    },
  });

  const title = form.watch("title");

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload = { ...values, content };
      if (isEdit && post) {
        await updateBlogPost(post.id, payload);
        toast.success(values.published ? "Post published" : "Post updated");
      } else {
        const created = await createBlogPost(payload);
        toast.success(values.published ? "Post published" : "Post created");
        router.push(`/admin/blog/edit/${created.id}`);
        return;
      }
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  {...form.register("slug")}
                  placeholder={title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                />
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea rows={2} {...form.register("excerpt")} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
            <Label className="mb-4 block">Content</Label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Publish
            </h2>
            <label className="mt-4 flex items-center gap-3">
              <Switch
                checked={form.watch("published")}
                onCheckedChange={(v) => form.setValue("published", v)}
              />
              <span className="text-sm font-medium">Published</span>
            </label>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="mt-4 w-full bg-primary font-semibold text-secondary hover:bg-primary/90"
            >
              {form.formState.isSubmitting ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
            </Button>
          </div>

          <div className="rounded-xl border border-border/80 bg-background p-6 shadow-sm space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <select {...form.register("categoryId")} className={selectClass}>
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Featured Image URL</Label>
              <Input {...form.register("featuredImage")} placeholder="https://..." />
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-background p-6 shadow-sm space-y-4">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              SEO
            </h2>
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input {...form.register("seoTitle")} placeholder={title} />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea rows={3} {...form.register("seoDescription")} />
            </div>
            <div className="space-y-2">
              <Label>OG Image</Label>
              <Input {...form.register("ogImage")} />
            </div>
            <div className="space-y-2">
              <Label>Canonical URL</Label>
              <Input {...form.register("canonicalUrl")} placeholder="https://..." />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
