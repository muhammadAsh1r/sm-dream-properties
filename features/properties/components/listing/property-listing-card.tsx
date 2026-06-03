"use client";

import Link from "next/link";
import Image from "next/image";
import { Bath, BedDouble, Calendar, MapPin, Maximize2, MessageCircle } from "lucide-react";

import { CardLift } from "@/components/motion/card-lift";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatArea,
  formatDate,
  formatKindLabel,
  formatPropertyPrice,
  getPropertyWhatsAppMessage,
} from "@/features/properties/lib/property-utils";
import { getWhatsAppUrl } from "@/lib/constants";
import type { Property } from "@/types/property";

type PropertyListingCardProps = {
  property: Property;
};

export function PropertyListingCard({ property }: PropertyListingCardProps) {
  const whatsappMessage = getPropertyWhatsAppMessage(property);

  return (
    <CardLift className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-background shadow-card transition-shadow hover:shadow-card-hover">
        <Link href={`/properties/${property.slug}`} className="relative block">
          <div className="relative aspect-[16/11] overflow-hidden bg-muted">
            {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No image
              </div>
            )}
            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
              <div className="flex flex-wrap gap-2">
                {property.featured && <Badge variant="featured">Featured</Badge>}
                {property.isNew && <Badge variant="newListing">New</Badge>}
              </div>
              <Badge variant={property.status === "sale" ? "forSale" : "forRent"}>
                {property.status === "sale" ? "For Sale" : "For Rent"}
              </Badge>
            </div>
            <div className="absolute bottom-3 left-3">
              <Badge variant="outline" className="border-white/30 bg-black/40 text-white backdrop-blur-sm">
                {formatKindLabel(property.kind)}
              </Badge>
            </div>
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-5">
          <div className="space-y-2">
            <p className="font-heading text-xl font-bold tracking-tight text-foreground">
              {formatPropertyPrice(property.price, property.currency, property.status)}
            </p>
            <Link href={`/properties/${property.slug}`}>
              <h3 className="font-heading text-base font-semibold leading-snug text-foreground transition-colors hover:text-primary">
                {property.title}
              </h3>
            </Link>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
              {property.location}
            </p>
          </div>

          <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-4 text-sm text-muted-foreground" role="list">
            <li className="inline-flex items-center gap-1.5">
              <Maximize2 className="size-3.5" aria-hidden="true" />
              {formatArea(property.area, property.areaUnit)}
            </li>
            {property.bedrooms !== undefined && (
              <li className="inline-flex items-center gap-1.5">
                <BedDouble className="size-3.5" aria-hidden="true" />
                {property.bedrooms} Beds
              </li>
            )}
            {property.bathrooms !== undefined && (
              <li className="inline-flex items-center gap-1.5">
                <Bath className="size-3.5" aria-hidden="true" />
                {property.bathrooms} Baths
              </li>
            )}
          </ul>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {property.shortDescription}
          </p>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <span>{property.agent.name}</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" aria-hidden="true" />
              {formatDate(property.createdAt)}
            </span>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              render={<Link href={`/properties/${property.slug}`} />}
              variant="outline"
              className="h-10 flex-1 border-foreground/15 font-semibold hover:border-primary/30 hover:bg-primary/5"
            >
              View Details
            </Button>
            <Button
              render={
                <a
                  href={getWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              className="h-10 shrink-0 bg-[#25D366] px-4 font-semibold text-white hover:bg-[#20bd5a]"
              aria-label={`WhatsApp inquiry for ${property.title}`}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </article>
    </CardLift>
  );
}
