import type { Property } from "@/types/property";

import { buildPropertyJsonLd } from "@/features/properties/lib/property-seo";

export function PropertyJsonLd({ property }: { property: Property }) {
  const { listing, breadcrumb } = buildPropertyJsonLd(property);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listing) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
