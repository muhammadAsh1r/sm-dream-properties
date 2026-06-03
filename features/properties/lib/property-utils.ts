import type { Property, PropertyStatus } from "@/types/property";

import { KIND_LABELS } from "../data/filter-options";

export function formatPropertyPrice(price: number, currency: string, status: PropertyStatus) {
  const suffix = status === "rent" ? "/mo" : "";

  if (currency === "PKR") {
    if (price >= 10_000_000) {
      return `PKR ${(price / 10_000_000).toFixed(2)} Cr${suffix}`;
    }
    if (price >= 100_000) {
      return `PKR ${(price / 100_000).toFixed(1)} Lakh${suffix}`;
    }
    return `PKR ${price.toLocaleString()}${suffix}`;
  }

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price) + suffix;
}

export function formatArea(area: number, unit: Property["areaUnit"]) {
  const unitLabel = unit === "sqft" ? "sq.ft" : unit;
  return `${area.toLocaleString()} ${unitLabel}`;
}

export function formatKindLabel(kind: Property["kind"]) {
  return KIND_LABELS[kind];
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getPropertyWhatsAppMessage(property: Property) {
  const price = formatPropertyPrice(property.price, property.currency, property.status);
  return `Hello SM Dream Properties, I am interested in:\n\n*${property.title}*\n${property.location}\n${price}\nRef: ${property.propertyId}\n\nPlease share more details.`;
}

export function getGoogleMapsEmbedUrl(lat: number, lng: number) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${lat},${lng}&zoom=15`;
  }
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}

export function getGoogleMapsLink(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
