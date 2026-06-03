"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { Input } from "@/components/ui/input";

type FilterOption = { label: string; value: string };

type AdminSearchBarProps = {
  placeholder?: string;
  filters?: { key: string; label: string; options: FilterOption[] }[];
};

export function AdminSearchBar({
  placeholder = "Search...",
  filters = [],
}: AdminSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const q = searchParams.get("q") ?? "";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          defaultValue={q}
          className="pl-9"
          onChange={(e) => updateParams({ q: e.target.value || null })}
        />
        {q && (
          <button
            type="button"
            onClick={() => updateParams({ q: null })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      {filters.map(({ key, label, options }) => {
        const value = searchParams.get(key) ?? "";
        return (
          <select
            key={key}
            value={value}
            onChange={(e) => updateParams({ [key]: e.target.value || null })}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label={label}
          >
            <option value="">{label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      })}
      {pending && (
        <span className="text-xs text-muted-foreground">Updating...</span>
      )}
    </div>
  );
}
