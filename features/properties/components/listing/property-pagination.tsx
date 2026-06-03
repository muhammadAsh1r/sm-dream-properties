"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PropertyPaginationProps = {
  page: number;
  totalPages: number;
};

export function PropertyPagination({ page, totalPages }: PropertyPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildHref(pageNum: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageNum));
    return `${pathname}?${params.toString()}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 ||
      p === totalPages ||
      Math.abs(p - page) <= 1
  );

  const withEllipsis: (number | "ellipsis")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) {
      withEllipsis.push("ellipsis");
    }
    withEllipsis.push(p);
  });

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Property pagination"
    >
      <Button
        render={<Link href={buildHref(Math.max(1, page - 1))} />}
        variant="outline"
        size="icon"
        className={cn("size-10", page <= 1 && "pointer-events-none opacity-40")}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </Button>

      <div className="flex items-center gap-1">
        {withEllipsis.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              …
            </span>
          ) : (
            <Link
              key={item}
              href={buildHref(item)}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                item === page
                  ? "bg-primary font-semibold text-secondary"
                  : "text-foreground/70 hover:bg-muted"
              )}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </Link>
          )
        )}
      </div>

      <Button
        render={<Link href={buildHref(Math.min(totalPages, page + 1))} />}
        variant="outline"
        size="icon"
        className={cn(
          "size-10",
          page >= totalPages && "pointer-events-none opacity-40"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}
