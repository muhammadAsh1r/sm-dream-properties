import { siteConfig } from "@/lib/constants";
import type { Property } from "@/types/property";

import { formatPropertyPrice } from "./property-utils";

export function buildPropertyMetadata(property: Property) {
  const price = formatPropertyPrice(
    property.price,
    property.currency,
    property.status
  );

  return {
    title: `${property.title} | ${price}`,
    description: property.shortDescription,
    openGraph: {
      title: property.title,
      description: property.shortDescription,
      images: [
        {
          url: property.images[0],
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      type: "website" as const,
      url: `${siteConfig.url}/properties/${property.slug}`,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: property.title,
      description: property.shortDescription,
      images: [property.images[0]],
    },
    alternates: {
      canonical: `${siteConfig.url}/properties/${property.slug}`,
    },
  };
}

export function buildPropertyJsonLd(property: Property) {
  return {
    listing: {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: property.title,
      description: property.shortDescription,
      url: `${siteConfig.url}/properties/${property.slug}`,
      datePosted: property.createdAt,
      image: property.images,
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: property.currency,
        availability: "https://schema.org/InStock",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: property.location,
        addressLocality: "Islamabad",
        addressCountry: "PK",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: property.coordinates.lat,
        longitude: property.coordinates.lng,
      },
      numberOfRooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.area,
        unitText: property.areaUnit,
      },
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Properties",
          item: `${siteConfig.url}/properties`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: property.title,
          item: `${siteConfig.url}/properties/${property.slug}`,
        },
      ],
    },
  };
}
