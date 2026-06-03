import type { Property } from "@/types/property";

type PropertyDescriptionProps = {
  property: Property;
};

export function PropertyDescription({ property }: PropertyDescriptionProps) {
  return (
    <section aria-labelledby="description-heading">
      <h2
        id="description-heading"
        className="font-heading text-h4 font-semibold text-foreground"
      >
        Description
      </h2>
      <div className="mt-4 space-y-6 text-foreground/85">
        <p className="text-body-lg leading-relaxed">{property.shortDescription}</p>

        {property.descriptionSections.map((section, index) => (
          <div key={index} className="space-y-3">
            {section.heading && (
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {section.heading}
              </h3>
            )}
            {section.paragraphs?.map((paragraph, pIndex) => (
              <p key={pIndex} className="leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="space-y-2" role="list">
                {section.list.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
