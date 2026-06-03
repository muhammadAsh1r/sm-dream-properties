"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bath, BedDouble, MapPin, Maximize2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardLift } from "@/components/motion/card-lift";
import { FadeUp } from "@/components/motion/fade-up";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/features/home/components/section-header";
import type { PropertyCardData } from "@/types/property";

function formatPrice(price: number, currency: string) {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(1)} Cr`;
  }
  if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(1)} Lakh`;
  }
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function FeaturedPropertyCard({ property }: { property: PropertyCardData }) {
  const {
    title,
    slug,
    price,
    currency,
    type,
    location,
    area,
    areaUnit,
    bedrooms,
    bathrooms,
    featured,
    isNew,
    imageUrl,
  } = property;

  return (
    <CardLift className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-background shadow-card transition-shadow hover:shadow-card-hover">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <div className="flex flex-wrap gap-2">
              {featured && <Badge variant="featured">Featured</Badge>}
              {isNew && <Badge variant="newListing">New Listing</Badge>}
            </div>
            <Badge variant={type === "sale" ? "forSale" : "forRent"}>
              {type === "sale" ? "For Sale" : "For Rent"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="font-heading text-xl font-bold tracking-tight text-foreground">
            {formatPrice(price, currency)}
          </p>
          <h3 className="mt-2 font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            {location}
          </p>

          <ul className="mt-4 flex flex-wrap items-center gap-4 border-t border-border/80 pt-4 text-sm text-muted-foreground" role="list">
            <li className="inline-flex items-center gap-1.5">
              <Maximize2 className="size-3.5" aria-hidden="true" />
              {area} {areaUnit}
            </li>
            {bedrooms !== undefined && (
              <li className="inline-flex items-center gap-1.5">
                <BedDouble className="size-3.5" aria-hidden="true" />
                {bedrooms} Beds
              </li>
            )}
            {bathrooms !== undefined && (
              <li className="inline-flex items-center gap-1.5">
                <Bath className="size-3.5" aria-hidden="true" />
                {bathrooms} Baths
              </li>
            )}
          </ul>

          <div className="mt-auto pt-5">
            <Button
              render={<Link href={`/properties/${slug}`} />}
              variant="outline"
              className="w-full border-foreground/15 font-semibold hover:border-primary/30 hover:bg-primary/5"
            >
              View Details
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </article>
    </CardLift>
  );
}

export function FeaturedPropertiesSection({
  properties,
}: {
  properties: PropertyCardData[];
}) {
  return (
    <Section spacing="md">
      <Container>
        <FadeUp>
          <SectionHeader
            eyebrow="Featured Listings"
            title="Premium Properties in Faisal Town"
            description="Handpicked residential and commercial opportunities — verified, documented, and ready for viewing."
          />
        </FadeUp>

        {properties.length === 0 ? (
          <FadeUp>
            <div className="mt-14 rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-muted-foreground">
                No featured properties yet. Check back soon or browse all listings.
              </p>
              <Button
                render={<Link href="/properties" />}
                size="lg"
                className="mt-6 bg-primary font-semibold text-secondary hover:bg-primary/90"
              >
                View All Properties
              </Button>
            </div>
          </FadeUp>
        ) : (
          <>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property, index) => (
                <FadeUp key={property.id} delay={index * 0.06}>
                  <FeaturedPropertyCard property={property} />
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.2}>
              <div className="mt-12 text-center">
                <Button
                  render={<Link href="/properties" />}
                  size="lg"
                  className="h-12 bg-primary px-8 font-semibold text-secondary hover:bg-primary/90"
                >
                  View All Properties
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </FadeUp>
          </>
        )}
      </Container>
    </Section>
  );
}
