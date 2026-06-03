import {
  Bath,
  BedDouble,
  Car,
  Home,
  Maximize2,
  Tag,
} from "lucide-react";

import { POSSESSION_LABELS } from "@/features/properties/data/filter-options";
import {
  formatArea,
  formatKindLabel,
} from "@/features/properties/lib/property-utils";
import type { Property } from "@/types/property";

type PropertyQuickFactsProps = {
  property: Property;
};

const factClass =
  "flex flex-col gap-2 rounded-xl border border-border/80 bg-muted/30 p-4";

export function PropertyQuickFacts({ property }: PropertyQuickFactsProps) {
  const facts = [
    {
      icon: Maximize2,
      label: "Area",
      value: formatArea(property.area, property.areaUnit),
    },
    property.bedrooms !== undefined && {
      icon: BedDouble,
      label: "Bedrooms",
      value: String(property.bedrooms),
    },
    property.bathrooms !== undefined && {
      icon: Bath,
      label: "Bathrooms",
      value: String(property.bathrooms),
    },
    property.garage !== undefined && {
      icon: Car,
      label: "Garage",
      value: String(property.garage),
    },
    {
      icon: Home,
      label: "Property Type",
      value: formatKindLabel(property.kind),
    },
    {
      icon: Tag,
      label: "Purpose",
      value: property.purpose,
    },
  ].filter(Boolean) as { icon: typeof Maximize2; label: string; value: string }[];

  return (
    <section aria-labelledby="quick-facts-heading">
      <h2
        id="quick-facts-heading"
        className="font-heading text-h4 font-semibold text-foreground"
      >
        Quick Facts
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className={factClass}>
            <Icon className="size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className="font-heading text-base font-semibold text-foreground">
                {value}
              </p>
            </div>
          </div>
        ))}
        <div className={factClass}>
          <Tag className="size-5 text-brand-accent" aria-hidden="true" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Possession</p>
            <p className="font-heading text-sm font-semibold text-foreground">
              {POSSESSION_LABELS[property.possessionStatus]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
