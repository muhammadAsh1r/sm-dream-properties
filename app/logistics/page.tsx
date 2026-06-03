import type { Metadata } from "next";

import { getPublicSiteConfig } from "@/features/content/queries/public";
import { LogisticsPageContent } from "@/features/logistics/components/logistics-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteConfig();
  return {
    title: "Logistics",
    description: `Nationwide goods transportation, fleet management, and commercial logistics from ${site.name} in Islamabad.`,
    openGraph: {
      title: `Logistics | ${site.name}`,
      description: site.description,
      url: `${site.url}/logistics`,
    },
    alternates: {
      canonical: `${site.url}/logistics`,
    },
  };
}

export default async function LogisticsPage() {
  const site = await getPublicSiteConfig();
  return <LogisticsPageContent site={site} />;
}
