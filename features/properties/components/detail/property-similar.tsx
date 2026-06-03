import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PropertyListingCard } from "@/features/properties/components/listing/property-listing-card";
import type { Property } from "@/types/property";

type PropertySimilarProps = {
  properties: Property[];
};

export function PropertySimilar({ properties }: PropertySimilarProps) {
  if (properties.length === 0) return null;

  return (
    <Section spacing="md" muted>
      <Container>
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            You May Also Like
          </p>
          <h2 className="font-heading text-h2 font-bold tracking-tight text-foreground">
            Similar Properties
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {properties.map((property) => (
            <PropertyListingCard key={property.id} property={property} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
