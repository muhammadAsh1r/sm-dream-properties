"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createBlogCategory,
  deleteBlogCategory,
} from "@/features/admin/actions/content";

type CategoryManagerProps = {
  categories: Category[];
};

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      await createBlogCategory(name.trim(), slug);
      toast.success("Category created");
      setName("");
      router.refresh();
    } catch {
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, categoryName: string) => {
    if (!confirm(`Delete category "${categoryName}"?`)) return;
    try {
      await deleteBlogCategory(id);
      toast.success("Category deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="rounded-xl border border-border/80 bg-background p-5 shadow-sm">
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Categories
      </h3>
      <form onSubmit={handleCreate} className="mt-4 flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={loading}>
          <Plus className="size-4" />
          Add
        </Button>
      </form>
      {categories.length > 0 && (
        <ul className="mt-4 divide-y divide-border/60">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between py-2 text-sm"
            >
              <span>{cat.name}</span>
              <button
                type="button"
                onClick={() => handleDelete(cat.id, cat.name)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Delete ${cat.name}`}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
