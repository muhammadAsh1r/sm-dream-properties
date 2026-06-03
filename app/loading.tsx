import { Container } from "@/components/layout/container";

export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-secondary/80 md:h-80" />
      <Container className="py-12">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-8 w-2/3 rounded-lg bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
