import { Container } from "@/components/layout/container";
import { trustBarItems } from "@/features/home/data/home-content";

export function TrustBarSection() {
  return (
    <section
      className="border-y border-border bg-secondary py-5"
      aria-label="Trust indicators"
    >
      <Container>
        <ul
          className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8"
          role="list"
        >
          {trustBarItems.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="flex items-center justify-center gap-3 md:justify-start"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-white/90">{label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
