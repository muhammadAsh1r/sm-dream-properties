"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Copy,
  Heart,
  MapPin,
  Share2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { POSSESSION_LABELS } from "@/features/properties/data/filter-options";
import {
  formatDate,
  formatKindLabel,
  formatPropertyPrice,
} from "@/features/properties/lib/property-utils";
import { siteConfig } from "@/lib/constants";
import type { Property } from "@/types/property";

type PropertyHeaderProps = {
  property: Property;
};

export function PropertyHeader({ property }: PropertyHeaderProps) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${siteConfig.url}/properties/${property.slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: property.title,
        text: property.shortDescription,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(property.propertyId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="space-y-4 border-b border-border/80 pb-6">
      <div className="flex flex-wrap gap-2">
        {property.featured && <Badge variant="featured">Featured</Badge>}
        <Badge variant={property.status === "sale" ? "forSale" : "forRent"}>
          {property.status === "sale" ? "For Sale" : "For Rent"}
        </Badge>
        <Badge variant="outline">{formatKindLabel(property.kind)}</Badge>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <h1 className="font-heading text-h2 font-bold tracking-tight text-foreground">
            {property.title}
          </h1>
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
            {property.location}
          </p>
          <p className="font-heading text-3xl font-bold tracking-tight text-primary md:text-4xl">
            {formatPropertyPrice(property.price, property.currency, property.status)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSaved((s) => !s)}
            className={saved ? "border-primary/30 bg-primary/5 text-primary" : ""}
            aria-pressed={saved}
          >
            <Heart className={saved ? "fill-primary" : ""} aria-hidden="true" />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 aria-hidden="true" />
            Share
          </Button>
          {copied && (
            <span className="text-xs font-medium text-primary">Copied!</span>
          )}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted-foreground">Property ID</dt>
          <dd className="mt-1 flex items-center gap-1 font-semibold text-foreground">
            {property.propertyId}
            <button
              type="button"
              onClick={handleCopyId}
              className="text-muted-foreground hover:text-primary"
              aria-label="Copy property ID"
            >
              <Copy className="size-3.5" />
            </button>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Listed</dt>
          <dd className="mt-1 flex items-center gap-1 font-semibold text-foreground">
            <Calendar className="size-3.5 text-primary" aria-hidden="true" />
            {formatDate(property.createdAt)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Purpose</dt>
          <dd className="mt-1 font-semibold text-foreground">{property.purpose}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Possession</dt>
          <dd className="mt-1 font-semibold text-foreground">
            {POSSESSION_LABELS[property.possessionStatus]}
          </dd>
        </div>
      </dl>

      <Link
        href="/properties"
        className="inline-flex text-sm font-medium text-primary hover:underline"
      >
        ← Back to all properties
      </Link>
    </header>
  );
}
