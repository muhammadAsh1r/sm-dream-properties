import { ExternalLink, MapPin } from "lucide-react";

import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsLink,
} from "@/features/properties/lib/property-utils";
import type { Property } from "@/types/property";

type PropertyLocationMapProps = {
  property: Property;
};

export function PropertyLocationMap({ property }: PropertyLocationMapProps) {
  const { lat, lng } = property.coordinates;
  const embedUrl = getGoogleMapsEmbedUrl(lat, lng);
  const mapsLink = getGoogleMapsLink(lat, lng);

  return (
    <section aria-labelledby="location-heading">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="location-heading"
          className="font-heading text-h4 font-semibold text-foreground"
        >
          Location
        </h2>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          Open in Google Maps
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>

      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="size-4 text-primary" aria-hidden="true" />
        {property.location}
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border/80 ring-1 ring-border/40">
        <iframe
          title={`Map showing location of ${property.title}`}
          src={embedUrl}
          className="aspect-[16/9] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {property.nearbyLandmarks.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-foreground">Nearby Landmarks</h3>
          <ul className="mt-2 space-y-1.5" role="list">
            {property.nearbyLandmarks.map((landmark) => (
              <li
                key={landmark}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-brand-accent" aria-hidden="true" />
                {landmark}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
