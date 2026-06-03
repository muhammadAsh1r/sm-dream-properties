"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeUp } from "@/components/motion/fade-up";
import { Button } from "@/components/ui/button";
import { logisticsContent } from "@/features/home/data/home-content";
import { fadeUpVariants } from "@/lib/animations";

export function LogisticsSection() {
  return (
    <Section spacing="lg" className="relative overflow-hidden bg-secondary">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgb(0_200_255_/_0.08),transparent)]" />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeUp>
            <div className="space-y-8">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
                  Logistics Division
                </p>
                <h2 className="font-heading text-h2 font-bold tracking-tight text-white">
                  {logisticsContent.headline}
                </h2>
                <p className="mt-4 text-body-lg leading-relaxed text-white/70">
                  {logisticsContent.subheadline}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {logisticsContent.services.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUpVariants}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-white/8"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <service.icon className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-heading text-base font-semibold text-white">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {service.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <Button
                render={<Link href="/logistics" />}
                size="xl"
                className="h-12 bg-primary px-8 font-semibold text-secondary hover:bg-primary/90"
              >
                Explore Logistics
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </FadeUp>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10 lg:aspect-square"
          >
            <Image
              src={logisticsContent.image}
              alt="Commercial logistics and freight transportation fleet"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/40 via-transparent to-transparent" />
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
