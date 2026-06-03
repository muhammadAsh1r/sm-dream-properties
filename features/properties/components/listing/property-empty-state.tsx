import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PropertyEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-8 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="mt-6 font-heading text-xl font-semibold text-foreground">
        No matching properties found
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Try adjusting your filters or search terms to discover more premium
        properties in Islamabad.
      </p>
      <Button
        render={<Link href="/properties" />}
        className="mt-8 bg-primary font-semibold text-secondary hover:bg-primary/90"
      >
        Clear Filters
      </Button>
    </div>
  );
}
