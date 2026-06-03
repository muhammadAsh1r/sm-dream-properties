import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PropertyDetailContent } from "@/features/properties/components/detail/property-detail-content";
import { PropertyJsonLd } from "@/features/properties/components/detail/property-json-ld";
import { buildPropertyMetadata } from "@/features/properties/lib/property-seo";
import {
  getPublishedPropertyBySlug,
  getPublishedPropertySlugs,
  getSimilarPublishedProperties,
} from "@/features/properties/queries/public";

type PropertyDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPublishedPropertySlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPublishedPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };
  return buildPropertyMetadata(property);
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPublishedPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const similar = await getSimilarPublishedProperties(property, 4);

  return (
    <>
      <PropertyJsonLd property={property} />
      <PropertyDetailContent property={property} similar={similar} />
    </>
  );
}
