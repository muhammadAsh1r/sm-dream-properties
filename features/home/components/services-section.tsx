"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardLift } from "@/components/motion/card-lift";
import { FadeUp } from "@/components/motion/fade-up";
import { SectionHeader } from "@/features/home/components/section-header";
import { homeServices } from "@/features/home/data/home-content";

export function ServicesSection() {
  return (
    <Section spacing="md" muted>
      <Container>
        <FadeUp>
          <SectionHeader
            eyebrow="Our Services"
            title="Complete Real Estate & Logistics Solutions"
            description="From finding your perfect property to managing nationwide logistics — one trusted partner for all your needs."
          />
        </FadeUp>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {homeServices.map((service, index) => (
            <FadeUp key={service.title} delay={index * 0.08}>
              <CardLift className="h-full">
                <Link
                  href={service.href}
                  className="group flex h-full flex-col rounded-2xl border border-border/80 bg-background p-7 shadow-card transition-colors hover:border-primary/20"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary group-hover:text-secondary">
                    <service.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-heading text-lg font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-primary/80">
                    Learn More
                    <ArrowUpRight
                      className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </CardLift>
            </FadeUp>
          ))}
        </div>
      </Container>
    </Section>
  );
}
