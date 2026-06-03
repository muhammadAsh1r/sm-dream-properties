import { Container } from "@/components/layout/container";
import { PropertyAgentCard } from "@/features/properties/components/detail/property-agent-card";
import { PropertyAmenities } from "@/features/properties/components/detail/property-amenities";
import { PropertyDescription } from "@/features/properties/components/detail/property-description";
import { PropertyGallery } from "@/features/properties/components/detail/property-gallery";
import { PropertyHeader } from "@/features/properties/components/detail/property-header";
import { PropertyInquiryCard } from "@/features/properties/components/detail/property-inquiry-card";
import { PropertyLocationMap } from "@/features/properties/components/detail/property-location-map";
import { PropertyMobileCta } from "@/features/properties/components/detail/property-mobile-cta";
import { PropertyQuickFacts } from "@/features/properties/components/detail/property-quick-facts";
import { PropertySimilar } from "@/features/properties/components/detail/property-similar";
import type { Property } from "@/types/property";

type PropertyDetailContentProps = {
  property: Property;
  similar: Property[];
};

export function PropertyDetailContent({
  property,
  similar,
}: PropertyDetailContentProps) {
  return (
    <>
      <Container className="py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
          <div className="space-y-10 pb-24 lg:pb-0">
            <PropertyGallery images={property.images} title={property.title} />
            <PropertyHeader property={property} />
            <PropertyQuickFacts property={property} />
            <PropertyDescription property={property} />
            <PropertyAmenities property={property} />
            <PropertyLocationMap property={property} />
            <PropertyAgentCard
              agent={property.agent}
              propertyTitle={property.title}
            />
          </div>

          <aside className="hidden lg:block">
            <PropertyInquiryCard property={property} />
          </aside>
        </div>

        {/* Mobile inquiry card inline */}
        <div className="mt-10 lg:hidden">
          <PropertyInquiryCard property={property} />
        </div>
      </Container>

      <PropertySimilar properties={similar} />
      <PropertyMobileCta property={property} />
    </>
  );
}
