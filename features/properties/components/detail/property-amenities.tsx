import { CheckCircle2 } from "lucide-react";

import type { Property } from "@/types/property";

type PropertyAmenitiesProps = {
  property: Property;
};

export function PropertyAmenities({ property }: PropertyAmenitiesProps) {
  return (
    <section aria-labelledby="amenities-heading">
      <h2
        id="amenities-heading"
        className="font-heading text-h4 font-semibold text-foreground"
      >
        Features & Amenities
      </h2>
      <ul
        className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
        role="list"
      >
        {property.amenities.map((amenity) => (
          <li
            key={amenity}
            className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-sm font-medium text-foreground"
          >
            <CheckCircle2
              className="size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            {amenity}
          </li>
        ))}
      </ul>
    </section>
  );
}
