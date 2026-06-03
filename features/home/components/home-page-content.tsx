import { FaqJsonLd } from "./faq-json-ld";
import { FaqSection } from "./faq-section";
import { FeaturedPropertiesSection } from "./featured-properties-section";
import { FinalCtaSection } from "./final-cta-section";
import { HeroSection } from "./hero-section";
import { InvestmentSection } from "./investment-section";
import { LogisticsSection } from "./logistics-section";
import { ServicesSection } from "./services-section";
import { StatsSection } from "./stats-section";
import { TestimonialsSection } from "./testimonials-section";
import { TrustBarSection } from "./trust-bar-section";
import { WhyChooseUsSection } from "./why-choose-us-section";
import type { PublicSiteStats } from "@/features/content/queries/public";
import type { PropertyCardData } from "@/types/property";
import type { Testimonial } from "@/types/service";

type HomePageContentProps = {
  featuredProperties: PropertyCardData[];
  testimonials: Testimonial[];
  stats: PublicSiteStats;
};

export function HomePageContent({
  featuredProperties,
  testimonials,
  stats,
}: HomePageContentProps) {
  return (
    <>
      <HeroSection stats={stats} />
      <TrustBarSection />
      <StatsSection stats={stats} />
      <ServicesSection />
      <FeaturedPropertiesSection properties={featuredProperties} />
      <WhyChooseUsSection />
      <InvestmentSection />
      <LogisticsSection />
      <TestimonialsSection testimonials={testimonials} />
      <FaqJsonLd />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}

export {
  FaqSection,
  FeaturedPropertiesSection,
  FinalCtaSection,
  HeroSection,
  InvestmentSection,
  LogisticsSection,
  ServicesSection,
  StatsSection,
  TestimonialsSection,
  TrustBarSection,
  WhyChooseUsSection,
};
