import type { PropertySearchParams } from "@/types/property";

import { PropertyListingContent } from "@/features/properties/components/listing/property-listing-content";
import { searchPublishedProperties } from "@/features/properties/queries/public";
import { getPublicSiteConfig } from "@/features/content/queries/public";
import type { Metadata } from "next";
import { Suspense } from "react";

type PropertiesPageProps = {
  searchParams: Promise<PropertySearchParams>;
};

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteConfig();
  return {
    title: "Explore Premium Properties In Islamabad",
    description:
      "Browse verified residential and commercial properties in Faisal Town, Faisal Hills, B17, and Islamabad. Filter by type, price, area, and more.",
    openGraph: {
      title: `Properties | ${site.name}`,
      description:
        "Discover premium verified property listings in Islamabad with SM Dream Properties.",
      url: `${site.url}/properties`,
    },
    alternates: {
      canonical: `${site.url}/properties`,
    },
  };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const { properties, total, page, totalPages } = await searchPublishedProperties(params);

  return (
    <Suspense>
      <PropertyListingContent
        properties={properties}
        total={total}
        page={page}
        totalPages={totalPages}
      />
    </Suspense>
  );
}
