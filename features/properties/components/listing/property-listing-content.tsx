import { Suspense } from "react";

import { Container } from "@/components/layout/container";
import { ListingHero } from "@/features/properties/components/listing/listing-hero";
import { PropertyEmptyState } from "@/features/properties/components/listing/property-empty-state";
import {
  PropertyFilters,
  PropertyFiltersDrawer,
  PropertySortBar,
} from "@/features/properties/components/listing/property-filters";
import { PropertyListingCard } from "@/features/properties/components/listing/property-listing-card";
import { PropertyPagination } from "@/features/properties/components/listing/property-pagination";
import type { Property } from "@/types/property";

type PropertyListingContentProps = {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
};

function PaginationFallback() {
  return <div className="h-10" />;
}

export function PropertyListingContent({
  properties,
  total,
  page,
  totalPages,
}: PropertyListingContentProps) {
  return (
    <>
      <ListingHero />

      <Container className="py-10 md:py-14">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">{properties.length}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{total}</span>{" "}
            properties
            {page > 1 && (
              <span> · Page {page} of {totalPages}</span>
            )}
          </p>
          <Suspense fallback={<PaginationFallback />}>
            <PropertySortBar />
          </Suspense>
        </div>

        <PropertyFiltersDrawer />

        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border/80 bg-background p-6 shadow-card">
              <h2 className="mb-6 font-heading text-lg font-semibold">Filters</h2>
              <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
                <PropertyFilters />
              </Suspense>
            </div>
          </aside>

          <div>
            {properties.length === 0 ? (
              <PropertyEmptyState />
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {properties.map((property) => (
                    <PropertyListingCard key={property.id} property={property} />
                  ))}
                </div>

                <div className="mt-12">
                  <Suspense fallback={<PaginationFallback />}>
                    <PropertyPagination page={page} totalPages={totalPages} />
                  </Suspense>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
