"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardLift } from "@/components/motion/card-lift";
import { FadeUp } from "@/components/motion/fade-up";
import { SectionHeader } from "@/features/home/components/section-header";
import { investmentOpportunities } from "@/features/home/data/home-content";

export function InvestmentSection() {
  return (
    <Section spacing="md">
      <Container>
        <FadeUp>
          <SectionHeader
            eyebrow="Investment Opportunities"
            title="Grow Your Portfolio in Islamabad's Premier Society"
            description="Strategic investment options across Faisal Town with documented ROI potential and expert advisory support."
          />
        </FadeUp>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {investmentOpportunities.map((item, index) => (
            <FadeUp key={item.title} delay={index * 0.08}>
              <CardLift className="h-full">
                <Link
                  href={item.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-background shadow-card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/90 px-3 py-1 text-xs font-semibold text-secondary">
                        <TrendingUp className="size-3" aria-hidden="true" />
                        {item.roi}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Explore
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </CardLift>
            </FadeUp>
          ))}
        </div>
      </Container>
    </Section>
  );
}
