"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { finalCtaContent } from "@/features/home/data/home-content";
import { getWhatsAppUrl } from "@/lib/constants";

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-secondary" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgb(0_200_255_/_0.12),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255_/_0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Trusted Since Faisal Town
          </div>

          <h2 className="font-heading text-h1 font-bold tracking-tight text-white">
            {finalCtaContent.headline}
          </h2>
          <p className="mt-5 text-body-lg leading-relaxed text-white/70">
            {finalCtaContent.subheadline}
          </p>
          <p className="mt-3 text-sm font-medium text-brand-accent">
            {finalCtaContent.urgency}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              render={
                <a
                  href={getWhatsAppUrl(
                    "Hello SM Dream Properties, I am interested in your property listings in Faisal Town."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              size="xl"
              className="h-12 w-full bg-[#25D366] px-8 font-semibold text-white hover:bg-[#20bd5a] sm:w-auto"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              WhatsApp Us
            </Button>
            <Button
              render={<Link href="/contact" />}
              variant="outline"
              size="xl"
              className="h-12 w-full border-white/20 bg-transparent px-8 font-semibold text-white hover:border-primary/40 hover:bg-white/5 sm:w-auto"
            >
              Contact Us
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
