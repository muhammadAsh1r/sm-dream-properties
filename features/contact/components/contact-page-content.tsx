import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";

import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/design-system/typography";
import { FadeUp } from "@/components/motion/fade-up";
import { Button } from "@/components/ui/button";
import type { PublicSiteConfig } from "@/features/content/queries/public";

type ContactPageContentProps = {
  site: PublicSiteConfig;
  mapCoords?: { lat?: number; lng?: number } | null;
};

function whatsAppUrl(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");
  if (!message) return `https://wa.me/${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function ContactPageContent({ site, mapCoords }: ContactPageContentProps) {
  const mapQuery =
    mapCoords?.lat && mapCoords?.lng
      ? `${mapCoords.lat},${mapCoords.lng}`
      : site.address.full;
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;
  const mapsLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  const contactItems = [
    {
      icon: Phone,
      label: "Phone",
      value: site.contact.phone,
      href: `tel:${site.contact.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us",
      href: whatsAppUrl(
        site.contact.whatsapp,
        `Hi ${site.name}, I'd like to inquire about a property.`
      ),
    },
    {
      icon: MapPin,
      label: "Office",
      value: site.address.full,
      href: mapsLinkUrl,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-secondary py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgb(0_200_255_/_0.12),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255 / 0.08) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Typography variant="eyebrow" className="text-brand-accent">
              Get In Touch
            </Typography>
            <Typography as="h1" variant="h1" className="mt-4 text-white">
              Contact SM Dream Properties
            </Typography>
            <Typography variant="bodyLarge" className="mt-4 text-white/70">
              Whether you&apos;re buying, selling, or investing — our team is
              ready to help you find the right opportunity in Islamabad.
            </Typography>
          </div>
        </Container>
      </section>

      <Section spacing="md">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
            <FadeUp>
              <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-sm md:p-8">
                <Typography as="h2" variant="h3" className="mb-2">
                  Send us a message
                </Typography>
                <Typography variant="small" className="mb-8">
                  Fill out the form and we&apos;ll get back to you within one
                  business day.
                </Typography>
                <ContactForm />
              </div>
            </FadeUp>

            <div className="space-y-6">
              <FadeUp delay={0.1}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {contactItems.map(({ icon: Icon, label, value, href }) => (
                    <a
                      key={label}
                      href={href}
                      target={label === "Office" || label === "WhatsApp" ? "_blank" : undefined}
                      rel={
                        label === "Office" || label === "WhatsApp"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="group flex gap-4 rounded-xl border border-border/80 bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    >
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-secondary">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </FadeUp>

              <FadeUp delay={0.15}>
                <div className="rounded-xl border border-border/80 bg-muted/40 p-5">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-5 shrink-0 text-brand-accent" />
                    <div>
                      <p className="font-heading text-sm font-semibold">
                        Office Hours
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Mon – Sat: 10:00 AM – 7:00 PM
                        <br />
                        Sunday: By appointment
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.2}>
                <Button
                  render={
                    <Link
                      href={whatsAppUrl(
                        site.contact.whatsapp,
                        `Hi ${site.name}, I'd like to inquire about a property.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  size="lg"
                  className="w-full bg-[#25D366] font-semibold text-white hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp Us
                </Button>
              </FadeUp>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="sm" muted className="border-t border-border/60">
        <Container>
          <FadeUp>
            <div className="overflow-hidden rounded-2xl border border-border/80 shadow-sm">
              <div className="border-b border-border/60 bg-background px-6 py-4">
                <Typography as="h2" variant="h4">
                  Visit Our Office
                </Typography>
                <Typography variant="small" className="mt-1">
                  {site.address.line1}, {site.address.line2}, {site.address.line3}
                </Typography>
              </div>
              <iframe
                title="SM Dream Properties office location"
                src={mapsEmbedUrl}
                className="h-72 w-full border-0 md:h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </FadeUp>
        </Container>
      </Section>
    </>
  );
}
