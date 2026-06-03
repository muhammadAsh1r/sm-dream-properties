"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { heroContent } from "@/features/home/data/home-content";
import type { PublicSiteStats } from "@/features/content/queries/public";
import { fadeUpVariants, staggerContainerVariants } from "@/lib/animations";

type HeroSectionProps = {
  stats: PublicSiteStats;
};

export function HeroSection({ stats }: HeroSectionProps) {
  const floatingStats = [
    { value: `${stats.propertiesListed}+`, label: "Properties" },
    { value: `${Math.max(stats.happyClients, stats.testimonials)}+`, label: "Happy Clients" },
  ];
  return (
    <section className="relative min-h-[100svh] overflow-hidden hero-gradient">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)] opacity-40" />

      <Container className="relative flex min-h-[100svh] items-center py-16 lg:py-24">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={fadeUpVariants} className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Faisal Town · Islamabad
              </span>
              <h1 className="font-heading text-hero font-bold tracking-tight text-foreground">
                {heroContent.headline}
              </h1>
              <p className="max-w-xl text-body-lg leading-relaxed text-muted-foreground">
                {heroContent.subheadline}
              </p>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              className="flex flex-wrap gap-4"
            >
              <Button
                render={<Link href="/properties" />}
                size="lg"
                className="h-12 bg-primary px-8 font-semibold text-secondary shadow-md hover:bg-primary/90"
              >
                View Properties
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button
                render={<Link href="/contact" />}
                variant="outline"
                size="lg"
                className="h-12 border-foreground/15 px-8 font-semibold hover:border-primary/30 hover:bg-primary/5"
              >
                Contact Us
              </Button>
            </motion.div>

            <motion.ul
              variants={fadeUpVariants}
              className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6"
              role="list"
            >
              {heroContent.trustBadges.map((badge) => (
                <li
                  key={badge}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80"
                >
                  <CheckCircle2
                    className="size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {badge}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-card-hover ring-1 ring-black/5 sm:aspect-[5/6] lg:aspect-[4/5]">
              <Image
                src={heroContent.image}
                alt={heroContent.imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {floatingStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6 + index * 0.15,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="glass absolute rounded-xl px-5 py-4 shadow-lg"
                style={{
                  top: index === 0 ? "8%" : undefined,
                  bottom: index === 1 ? "12%" : undefined,
                  left: index === 0 ? "-8%" : undefined,
                  right: index === 1 ? "-6%" : undefined,
                }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <p className="font-heading text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              </motion.div>
            ))}

            <div className="glass absolute bottom-6 left-6 right-6 rounded-xl px-5 py-4 lg:hidden">
              <div className="flex items-center justify-between gap-4">
                {floatingStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-heading text-lg font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
