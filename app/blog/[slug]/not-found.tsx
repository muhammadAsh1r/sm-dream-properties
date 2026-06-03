import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/design-system/typography";
import { Button } from "@/components/ui/button";

export default function BlogPostNotFound() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <Typography as="h1" variant="h1" className="mb-4">
            Article Not Found
          </Typography>
          <Typography variant="body" className="mb-8 text-muted-foreground">
            This blog post doesn&apos;t exist or may have been unpublished.
          </Typography>
          <Button render={<Link href="/blog" />} className="bg-primary font-semibold text-secondary">
            Back to Blog
          </Button>
        </div>
      </Container>
    </Section>
  );
}
