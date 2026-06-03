import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Maximize2 } from "lucide-react";

import { CardLift } from "@/components/motion/card-lift";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PropertyCardData } from "@/types/property";

type PropertyCardProps = {
  property: PropertyCardData;
  className?: string;
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function PropertyCard({ property, className }: PropertyCardProps) {
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
    <CardLift className={cn("h-full", className)}>
      <Card className="h-full overflow-hidden border-border/80 py-0 shadow-card transition-shadow hover:shadow-card-hover">
        <Link href={`/properties/${slug}`} className="group block">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
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

          <CardContent className="space-y-4 px-5 py-5">
            <div className="space-y-2">
              <p className="font-heading text-xl font-bold tracking-tight text-foreground">
                {formatPrice(price, currency)}
              </p>
              <h3 className="font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                {title}
              </h3>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                {location}
              </p>
            </div>
          </CardContent>
        </Link>

        <CardFooter className="border-t border-border/80 bg-muted/30 px-5 py-4">
          <ul className="flex w-full items-center gap-4 text-sm text-muted-foreground" role="list">
            <li className="inline-flex items-center gap-1.5">
              <Maximize2 className="size-3.5" aria-hidden="true" />
              <span>
                {area} {areaUnit}
              </span>
            </li>
            {bedrooms !== undefined && (
              <li className="inline-flex items-center gap-1.5">
                <BedDouble className="size-3.5" aria-hidden="true" />
                <span>{bedrooms} Beds</span>
              </li>
            )}
            {bathrooms !== undefined && (
              <li className="inline-flex items-center gap-1.5">
                <Bath className="size-3.5" aria-hidden="true" />
                <span>{bathrooms} Baths</span>
              </li>
            )}
          </ul>
        </CardFooter>
      </Card>
    </CardLift>
  );
}
