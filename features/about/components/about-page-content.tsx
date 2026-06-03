import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/design-system/typography";
import { FadeUp } from "@/components/motion/fade-up";
import { Button } from "@/components/ui/button";
import type {
  PublicSiteConfig,
  PublicSiteStats,
  PublicTeamMember,
} from "@/features/content/queries/public";
import { SectionHeader } from "@/features/home/components/section-header";
import { StatsSection } from "@/features/home/components/stats-section";
import { heroContent, whyChooseUsFeatures } from "@/features/home/data/home-content";
import { ROLE_LABELS } from "@/lib/auth/permissions";

type AboutPageContentProps = {
  site: PublicSiteConfig;
  stats: PublicSiteStats;
  team: PublicTeamMember[];
};

function TeamCard({ member }: { member: PublicTeamMember }) {
  const displayName = member.name ?? member.email.split("@")[0];
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-2xl border border-border/80 bg-background p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="mx-auto flex size-20 items-center justify-center overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/20">
        {member.avatarUrl ? (
          <Image
            src={member.avatarUrl}
            alt={displayName}
            width={80}
            height={80}
            className="size-full object-cover"
          />
        ) : (
          <span className="font-heading text-lg font-bold text-primary">{initials}</span>
        )}
      </div>
      <h3 className="mt-4 font-heading text-lg font-semibold">{displayName}</h3>
      <p className="mt-1 text-sm text-brand-accent">
        {ROLE_LABELS[member.role as keyof typeof ROLE_LABELS] ?? "Advisor"}
      </p>
      <a
        href={`mailto:${member.email}`}
        className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
      >
        <Mail className="size-3.5" />
        {member.email}
      </a>
    </div>
  );
}

export function AboutPageContent({ site, stats, team }: AboutPageContentProps) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-secondary py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgb(0_200_255_/_0.12),transparent)]" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Typography variant="eyebrow" className="text-brand-accent">
              About Us
            </Typography>
            <Typography as="h1" variant="h1" className="mt-4 text-white">
              {site.name}
            </Typography>
            <Typography variant="bodyLarge" className="mt-4 text-white/70">
              {site.tagline}
            </Typography>
          </div>
        </Container>
      </section>

      <Section spacing="md">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <FadeUp>
              <div>
                <SectionHeader
                  align="left"
                  eyebrow="Our Story"
                  title="Trusted Property Advisors in Faisal Town"
                  description={site.description}
                />
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  Based in {site.address.full}, we help buyers, sellers, and
                  investors navigate Islamabad&apos;s real estate market with
                  transparency and expert guidance. From residential plots to
                  commercial opportunities, every listing is verified and every
                  client receives dedicated advisory support.
                </p>
                <Button
                  render={<Link href="/properties" />}
                  size="lg"
                  className="mt-8 bg-primary font-semibold text-secondary hover:bg-primary/90"
                >
                  Browse Properties
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/80 shadow-lg">
                <Image
                  src={heroContent.image}
                  alt={heroContent.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeUp>
          </div>
        </Container>
      </Section>

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
                <div className="group h-full rounded-2xl border border-border/80 bg-background p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent ring-1 ring-brand-accent/20 transition-colors group-hover:bg-brand-accent group-hover:text-secondary">
                    <feature.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-heading text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>

      <StatsSection stats={stats} />

      <Section spacing="md" id="team">
        <Container>
          <FadeUp>
            <SectionHeader
              eyebrow="Our Team"
              title="Meet the People Behind SM Dream"
              description="Experienced advisors dedicated to helping you find, sell, and invest in the right property."
            />
          </FadeUp>

          {team.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              Our team profiles will appear here soon.
            </div>
          ) : (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {team.map((member, index) => (
                <FadeUp key={member.id} delay={index * 0.05}>
                  <TeamCard member={member} />
                </FadeUp>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <section className="relative overflow-hidden border-t border-border py-20 md:py-24">
        <div className="absolute inset-0 bg-secondary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgb(0_200_255_/_0.1),transparent)]" />
        <Container className="relative">
          <FadeUp>
            <div className="mx-auto max-w-2xl text-center">
              <Typography as="h2" variant="h2" className="text-white">
                Ready to work with us?
              </Typography>
              <Typography variant="bodyLarge" className="mt-4 text-white/70">
                Speak with our team about buying, selling, or investing in
                Faisal Town and Islamabad.
              </Typography>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  render={<Link href="/contact" />}
                  size="lg"
                  className="bg-primary font-semibold text-secondary hover:bg-primary/90"
                >
                  Contact Us
                </Button>
                <Button
                  render={<Link href="/properties" />}
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  View Listings
                </Button>
              </div>
            </div>
          </FadeUp>
        </Container>
      </section>
    </>
  );
}
