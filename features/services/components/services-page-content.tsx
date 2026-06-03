import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChartLine,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeUp } from "@/components/motion/fade-up";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/features/home/components/section-header";
import type { PublicSiteConfig } from "@/features/content/queries/public";

const serviceSections: {
  id: string;
  title: string;
  description: string;
  points: string[];
  icon: LucideIcon;
  cta: { label: string; href: string };
}[] = [
  {
    id: "buy",
    title: "Buy Property",
    description:
      "Find verified residential and commercial listings across Faisal Town with end-to-end advisory support.",
    points: [
      "Curated listings with legal verification",
      "Block-level market insights and pricing guidance",
      "Support through negotiation, token, and transfer",
    ],
    icon: Building2,
    cta: { label: "Browse properties", href: "/properties?type=buy" },
  },
  {
    id: "sell",
    title: "Sell Property",
    description:
      "Reach qualified buyers faster with professional marketing, valuation, and transaction management.",
    points: [
      "Accurate market valuation and pricing strategy",
      "Photography, listing optimization, and buyer screening",
      "Documentation and registry coordination",
    ],
    icon: TrendingUp,
    cta: { label: "Contact our team", href: "/contact" },
  },
  {
    id: "investment",
    title: "Investment Advisory",
    description:
      "Make confident decisions with ROI analysis, rental yield projections, and portfolio planning.",
    points: [
      "Plot, commercial, and rental investment strategies",
      "Capital appreciation and yield comparisons",
      "Long-term portfolio guidance for Faisal Town",
    ],
    icon: ChartLine,
    cta: { label: "Discuss investments", href: "/contact" },
  },
];

type ServicesPageContentProps = {
  site: PublicSiteConfig;
};

export function ServicesPageContent({ site }: ServicesPageContentProps) {
  return (
    <>
      <Section spacing="lg" className="border-b border-border/60 bg-muted/30 pt-28">
        <Container>
          <FadeUp>
            <SectionHeader
              align="left"
              eyebrow="Our Services"
              title="Real estate services built for Faisal Town"
              description={`${site.name} helps you buy, sell, and invest with verified listings, local expertise, and transparent processes.`}
            />
          </FadeUp>
        </Container>
      </Section>

      {serviceSections.map((service, index) => (
        <Section
          key={service.id}
          id={service.id}
          spacing="md"
          className={index % 2 === 1 ? "bg-muted/20" : undefined}
        >
          <Container>
            <FadeUp>
              <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <service.icon className="size-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                    {service.title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-body-lg leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-foreground/90">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Button render={<Link href={service.cta.href} />} className="mt-8">
                    {service.cta.label}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </FadeUp>
          </Container>
        </Section>
      ))}

      <Section spacing="md" muted>
        <Container>
          <FadeUp>
            <div className="rounded-2xl border border-border/80 bg-background p-8 shadow-card md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
                Also available
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold">Logistics Solutions</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Need transportation or fleet support for your business? Explore our nationwide
                logistics division.
              </p>
              <Button render={<Link href="/logistics" />} variant="outline" className="mt-6">
                View logistics services
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </FadeUp>
        </Container>
      </Section>
    </>
  );
}
