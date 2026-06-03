"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Filter, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AREA_PRESETS,
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  PROPERTY_KINDS,
  PROPERTY_LOCATIONS,
  PROPERTY_STATUSES,
  SORT_OPTIONS,
} from "@/features/properties/data/filter-options";
import { cn } from "@/lib/utils";
import type { PropertySearchParams } from "@/types/property";

type PropertyFiltersProps = {
  className?: string;
  onApplied?: () => void;
};

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

const selectClassName =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function PropertyFilters({ className, onApplied }: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [local, setLocal] = useState<PropertySearchParams>(() => ({
    kind: searchParams.get("kind") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    area: searchParams.get("area") ?? "",
    customAreaMin: searchParams.get("customAreaMin") ?? "",
    customAreaMax: searchParams.get("customAreaMax") ?? "",
    location: searchParams.get("location") ?? "",
    status: searchParams.get("status") ?? "",
    bedrooms: searchParams.get("bedrooms") ?? "",
    bathrooms: searchParams.get("bathrooms") ?? "",
    q: searchParams.get("q") ?? "",
    sort: searchParams.get("sort") ?? "latest",
  }));

  const applyFilters = useCallback(
    (overrides?: Partial<PropertySearchParams>) => {
      const next = { ...local, ...overrides };
      const params = new URLSearchParams();

      Object.entries(next).forEach(([key, value]) => {
        if (value && value !== "latest") params.set(key, value);
      });

      if (next.sort === "latest") params.delete("sort");
      params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        onApplied?.();
      });
    },
    [local, pathname, router, onApplied]
  );

  const clearFilters = () => {
    setLocal({ sort: "latest" });
    startTransition(() => {
      router.push(pathname, { scroll: false });
      onApplied?.();
    });
  };

  const update = (key: keyof PropertySearchParams, value: string) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={cn("space-y-6", className)}>
      <FilterField label="Keyword Search">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search properties..."
            value={local.q ?? ""}
            onChange={(e) => update("q", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="pl-9"
          />
        </div>
      </FilterField>

      <FilterField label="Property Type">
        <select
          value={local.kind ?? ""}
          onChange={(e) => update("kind", e.target.value)}
          className={selectClassName}
        >
          <option value="">All Types</option>
          {PROPERTY_KINDS.map((k) => (
            <option key={k.value} value={k.value}>{k.label}</option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Status">
        <select
          value={local.status ?? ""}
          onChange={(e) => update("status", e.target.value)}
          className={selectClassName}
        >
          <option value="">All Status</option>
          {PROPERTY_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Location">
        <select
          value={local.location ?? ""}
          onChange={(e) => update("location", e.target.value)}
          className={selectClassName}
        >
          <option value="">All Locations</option>
          {PROPERTY_LOCATIONS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </FilterField>

      <div className="grid grid-cols-2 gap-3">
        <FilterField label="Min Price (PKR)">
          <Input
            type="number"
            placeholder="0"
            value={local.minPrice ?? ""}
            onChange={(e) => update("minPrice", e.target.value)}
          />
        </FilterField>
        <FilterField label="Max Price (PKR)">
          <Input
            type="number"
            placeholder="Any"
            value={local.maxPrice ?? ""}
            onChange={(e) => update("maxPrice", e.target.value)}
          />
        </FilterField>
      </div>

      <FilterField label="Area">
        <select
          value={local.area ?? ""}
          onChange={(e) => update("area", e.target.value)}
          className={selectClassName}
        >
          <option value="">Any Area</option>
          {AREA_PRESETS.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
      </FilterField>

      {local.area === "custom" && (
        <div className="grid grid-cols-2 gap-3">
          <FilterField label="Min Marla">
            <Input
              type="number"
              value={local.customAreaMin ?? ""}
              onChange={(e) => update("customAreaMin", e.target.value)}
            />
          </FilterField>
          <FilterField label="Max Marla">
            <Input
              type="number"
              value={local.customAreaMax ?? ""}
              onChange={(e) => update("customAreaMax", e.target.value)}
            />
          </FilterField>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <FilterField label="Bedrooms">
          <select
            value={local.bedrooms ?? ""}
            onChange={(e) => update("bedrooms", e.target.value)}
            className={selectClassName}
          >
            <option value="">Any</option>
            {BEDROOM_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Bathrooms">
          <select
            value={local.bathrooms ?? ""}
            onChange={(e) => update("bathrooms", e.target.value)}
            className={selectClassName}
          >
            <option value="">Any</option>
            {BATHROOM_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>
        </FilterField>
      </div>

      <FilterField label="Sort By">
        <select
          value={local.sort ?? "latest"}
          onChange={(e) => update("sort", e.target.value)}
          className={selectClassName}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </FilterField>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          onClick={() => applyFilters()}
          disabled={isPending}
          className="h-11 w-full bg-primary font-semibold text-secondary hover:bg-primary/90"
        >
          <Filter className="size-4" aria-hidden="true" />
          {isPending ? "Applying..." : "Apply Filters"}
        </Button>
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="h-10 w-full font-medium text-muted-foreground"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Clear All
        </Button>
      </div>
    </div>
  );
}

export function PropertyFiltersDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="h-11 w-full border-foreground/15 font-semibold"
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filters & Sort
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close filters"
          />
          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-heading text-lg font-semibold">Filters</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-muted"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <PropertyFilters onApplied={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PropertySortBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "latest";

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "latest") params.delete("sort");
    else params.set("sort", sort);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <span className="text-sm text-muted-foreground">Sort:</span>
      <select
        value={currentSort}
        onChange={(e) => handleSort(e.target.value)}
        className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label="Sort properties"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
