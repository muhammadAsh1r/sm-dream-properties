"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeUp } from "@/components/motion/fade-up";
import { SectionHeader } from "@/features/home/components/section-header";
import type { Testimonial } from "@/types/service";
import { cn } from "@/lib/utils";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setActive(index);
  }, []);

  const next = useCallback(() => {
    if (testimonials.length === 0) return;
    goTo((active + 1) % testimonials.length, 1);
  }, [active, goTo, testimonials.length]);

  const prev = useCallback(() => {
    if (testimonials.length === 0) return;
    goTo((active - 1 + testimonials.length) % testimonials.length, -1);
  }, [active, goTo, testimonials.length]);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  const current = testimonials[active];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <Section spacing="md" muted>
      <Container>
        <FadeUp>
          <SectionHeader
            eyebrow="Client Testimonials"
            title="Trusted by Property Owners & Investors"
            description="Real experiences from clients who chose SM Dream Properties."
          />
        </FadeUp>

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-background p-8 shadow-card md:p-12">
            <Quote
              className="size-10 text-brand-accent/60"
              aria-hidden="true"
            />

            <div className="relative mt-6 min-h-[200px] md:min-h-[160px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <blockquote className="text-body-lg leading-relaxed text-foreground/90">
                    &ldquo;{current.content}&rdquo;
                  </blockquote>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="relative size-14 overflow-hidden rounded-full ring-2 ring-primary/20">
                      {current.avatarUrl ? (
                        <Image
                          src={current.avatarUrl}
                          alt={current.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-muted font-heading text-lg font-bold text-foreground">
                          {current.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div
                        className="mb-1 flex items-center gap-1"
                        role="img"
                        aria-label={`${current.rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-4",
                              i < current.rating
                                ? "fill-brand-accent text-brand-accent"
                                : "fill-muted text-muted"
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="font-heading font-semibold text-foreground">
                        {current.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {current.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Testimonials">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => goTo(i, i > active ? 1 : -1)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === active
                      ? "w-8 bg-primary"
                      : "w-2 bg-border hover:bg-primary/40"
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
              aria-label="Next testimonial"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
