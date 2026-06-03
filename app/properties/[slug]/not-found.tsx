import Link from "next/link";
import { Home, SearchX } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function PropertyNotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h1 className="mt-6 font-heading text-h2 font-bold text-foreground">
        Property Not Found
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        This property may have been sold or removed. Browse our current listings
        to find your next opportunity.
      </p>
      <div className="mt-8 flex gap-3">
        <Button
          render={<Link href="/properties" />}
          className="bg-primary font-semibold text-secondary hover:bg-primary/90"
        >
          Browse Properties
        </Button>
        <Button render={<Link href="/" />} variant="outline">
          <Home className="size-4" aria-hidden="true" />
          Home
        </Button>
      </div>
    </Container>
  );
}
