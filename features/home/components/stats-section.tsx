"use client";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeUp } from "@/components/motion/fade-up";
import { SectionHeader } from "@/features/home/components/section-header";
import type { PublicSiteStats } from "@/features/content/queries/public";
import { useCountUp } from "@/hooks/use-count-up";

function StatCard({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { ref, display } = useCountUp({ end: value, suffix });

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-border/80 bg-background p-8 text-center shadow-card transition-shadow hover:shadow-card-hover"
    >
      <p className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        {display}
      </p>
      <p className="mt-2 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

type StatsSectionProps = {
  stats: PublicSiteStats;
};

export function StatsSection({ stats }: StatsSectionProps) {
  const companyStats = [
    { value: stats.propertiesListed, suffix: "+", label: "Properties Listed" },
    { value: stats.featuredProperties, suffix: "+", label: "Featured Listings" },
    { value: Math.max(stats.happyClients, stats.testimonials), suffix: "+", label: "Happy Clients" },
    { value: stats.testimonials, suffix: "+", label: "Client Reviews" },
  ];

  return (
    <Section spacing="md">
      <Container>
        <FadeUp>
          <SectionHeader
            eyebrow="Our Track Record"
            title="Numbers That Build Trust"
            description="Live metrics from our property portfolio and client relationships."
          />
        </FadeUp>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {companyStats.map((stat, index) => (
            <FadeUp key={stat.label} delay={index * 0.08}>
              <StatCard
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            </FadeUp>
          ))}
        </div>
      </Container>
    </Section>
  );
}
