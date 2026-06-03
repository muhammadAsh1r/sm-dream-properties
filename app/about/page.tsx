import type { Metadata } from "next";

import {
  getPublicSiteConfig,
  getPublicSiteStats,
  getPublicTeamMembers,
} from "@/features/content/queries/public";
import { AboutPageContent } from "@/features/about/components/about-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteConfig();
  return {
    title: "About Us",
    description: `Learn about ${site.name} — trusted property advisors in Faisal Town, Islamabad. Verified listings, expert guidance, and transparent transactions.`,
    openGraph: {
      title: `About | ${site.name}`,
      description: site.description,
      url: `${site.url}/about`,
    },
    alternates: {
      canonical: `${site.url}/about`,
    },
  };
}

export default async function AboutPage() {
  const [site, stats, team] = await Promise.all([
    getPublicSiteConfig(),
    getPublicSiteStats(),
    getPublicTeamMembers(),
  ]);

  return <AboutPageContent site={site} stats={stats} team={team} />;
}
