import type { Metadata } from "next";

import { getPublicSiteConfig } from "@/features/content/queries/public";
import { ServicesPageContent } from "@/features/services/components/services-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteConfig();
  return {
    title: "Services",
    description: `Buy, sell, and invest in Faisal Town property with ${site.name}. Expert advisory, verified listings, and transparent transactions.`,
    openGraph: {
      title: `Services | ${site.name}`,
      description: site.description,
      url: `${site.url}/services`,
    },
    alternates: {
      canonical: `${site.url}/services`,
    },
  };
}

export default async function ServicesPage() {
  const site = await getPublicSiteConfig();
  return <ServicesPageContent site={site} />;
}
