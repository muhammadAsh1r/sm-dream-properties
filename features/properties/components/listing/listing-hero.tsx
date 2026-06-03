"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ListingHero() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary py-16 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgb(0_200_255_/_0.1),transparent)]" />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            Premium Listings
          </p>
          <h1 className="font-heading text-h1 font-bold tracking-tight text-white">
            Explore Premium Properties In Islamabad
          </h1>
          <p className="mt-4 text-body-lg leading-relaxed text-white/70">
            Discover verified residential and commercial opportunities with expert
            guidance.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
            role="search"
          >
            <div className="relative flex-1">
              <Search
                className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search by location, title, or property ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 border-white/10 bg-white pl-11 text-foreground shadow-lg"
                aria-label="Search properties"
              />
            </div>
            <Button
              type="submit"
              size="xl"
              className="h-12 shrink-0 bg-primary px-8 font-semibold text-secondary hover:bg-primary/90"
            >
              Search
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
