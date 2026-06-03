import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeUp } from "@/components/motion/fade-up";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/features/home/components/section-header";
import { logisticsContent } from "@/features/home/data/home-content";
import type { PublicSiteConfig } from "@/features/content/queries/public";

type LogisticsPageContentProps = {
  site: PublicSiteConfig;
};

export function LogisticsPageContent({ site }: LogisticsPageContentProps) {
  return (
    <>
      <Section spacing="lg" className="relative overflow-hidden bg-secondary pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgb(0_200_255_/_0.12),transparent)]" />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeUp>
              <SectionHeader
                align="left"
                dark
                eyebrow="Logistics Division"
                title={logisticsContent.headline}
                description={logisticsContent.subheadline}
              />
              <Button render={<Link href="/contact" />} className="mt-8">
                Request a quote
                <ArrowRight className="size-4" />
              </Button>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                <Image
                  src={logisticsContent.image}
                  alt="SM Dream Properties logistics fleet"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </FadeUp>
          </div>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <FadeUp>
            <SectionHeader
              eyebrow="What we offer"
              title="Commercial logistics you can rely on"
              description={`${site.name} supports businesses across Pakistan with professional transportation and fleet operations.`}
            />
          </FadeUp>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {logisticsContent.services.map((service, index) => (
              <FadeUp key={service.title} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-border/80 bg-background p-7 shadow-card">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <service.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="md" muted>
        <Container>
          <FadeUp>
            <div className="rounded-2xl border border-border/80 bg-background p-8 text-center shadow-card md:p-12">
              <h2 className="font-heading text-2xl font-bold md:text-3xl">
                Need property and logistics under one roof?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Talk to our team about commercial property requirements and logistics support for
                your operations in Islamabad and beyond.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button render={<Link href="/contact" />}>Contact us</Button>
                <Button render={<Link href="/properties" />} variant="outline">
                  View properties
                </Button>
              </div>
            </div>
          </FadeUp>
        </Container>
      </Section>
    </>
  );
}
