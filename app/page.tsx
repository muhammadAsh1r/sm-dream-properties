import { HomePageContent } from "@/features/home";
import {
  getPublicSiteStats,
  getPublicTestimonials,
} from "@/features/content/queries/public";
import { getFeaturedPublishedProperties } from "@/features/properties/queries/public";
import { toPropertyCardData } from "@/types/property";

export default async function HomePage() {
  const [featuredRows, testimonials, stats] = await Promise.all([
    getFeaturedPublishedProperties(6),
    getPublicTestimonials(),
    getPublicSiteStats(),
  ]);

  const featuredProperties = featuredRows.map(toPropertyCardData);

  return (
    <HomePageContent
      featuredProperties={featuredProperties}
      testimonials={testimonials}
      stats={stats}
    />
  );
}
