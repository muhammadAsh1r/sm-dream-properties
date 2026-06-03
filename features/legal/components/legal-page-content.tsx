import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeUp } from "@/components/motion/fade-up";

type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalPageContentProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
  updatedLabel?: string;
};

export function LegalPageContent({
  title,
  intro,
  sections,
  updatedLabel = "Last updated: June 2026",
}: LegalPageContentProps) {
  return (
    <Section spacing="lg" className="border-b border-border/60 bg-muted/30 pt-28">
      <Container className="max-w-3xl">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            Legal
          </p>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{updatedLabel}</p>
          <p className="mt-6 text-body-lg leading-relaxed text-muted-foreground">{intro}</p>
        </FadeUp>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <FadeUp key={section.title}>
              <section>
                <h2 className="font-heading text-xl font-semibold">{section.title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            </FadeUp>
          ))}
        </div>
      </Container>
    </Section>
  );
}
