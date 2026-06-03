"use client";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeUp } from "@/components/motion/fade-up";
import { SectionHeader } from "@/features/home/components/section-header";
import { whyChooseUsFeatures } from "@/features/home/data/home-content";

export function WhyChooseUsSection() {
  return (
    <Section spacing="md" muted>
      <Container>
        <FadeUp>
          <SectionHeader
            eyebrow="Why SM Dream Properties"
            title="The Standard of Trust in Faisal Town Real Estate"
            description="We combine local expertise, legal rigor, and premium service to deliver outcomes you can rely on."
          />
        </FadeUp>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUsFeatures.map((feature, index) => (
            <FadeUp key={feature.title} delay={index * 0.06}>
              <div className="group h-full rounded-2xl border border-border/80 bg-background p-8 shadow-card transition-all hover:border-primary/20 hover:shadow-card-hover">
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent ring-1 ring-brand-accent/20 transition-colors group-hover:bg-brand-accent group-hover:text-secondary">
                  <feature.icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-6 font-heading text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Container>
    </Section>
  );
}
