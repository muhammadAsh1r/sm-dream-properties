import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeUp } from "@/components/motion/fade-up";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/features/home/components/section-header";
import { faqItems } from "@/features/home/data/home-content";

export function FaqSection() {
  return (
    <Section spacing="md">
      <Container className="max-w-3xl">
        <FadeUp>
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="Everything you need to know about buying property and our services in Faisal Town."
          />
        </FadeUp>

        <FadeUp delay={0.1}>
          <Accordion defaultValue={["item-0"]} className="mt-12 w-full">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`item-${index}`}
                className="border-border/80"
              >
                <AccordionTrigger className="py-5 text-left font-heading text-base font-semibold hover:text-primary hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </Container>
    </Section>
  );
}
