import { Quote, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/design-system/typography";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/service";

type TestimonialCardProps = {
  testimonial: Testimonial;
  className?: string;
};

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const { name, role, content, rating } = testimonial;

  return (
    <Card
      className={cn(
        "h-full border-border/80 bg-background py-0 shadow-card",
        className
      )}
    >
      <CardContent className="flex h-full flex-col gap-6 px-6 py-7">
        <Quote
          className="size-8 text-brand-accent/70"
          aria-hidden="true"
        />
        <Typography variant="bodyLarge" className="flex-1 text-foreground/85">
          &ldquo;{content}&rdquo;
        </Typography>
        <div className="space-y-3 border-t border-border/80 pt-5">
          <div
            className="flex items-center gap-1"
            role="img"
            aria-label={`${rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={cn(
                  "size-4",
                  index < rating
                    ? "fill-brand-accent text-brand-accent"
                    : "fill-muted text-muted"
                )}
                aria-hidden="true"
              />
            ))}
          </div>
          <div>
            <p className="font-heading text-base font-semibold text-foreground">
              {name}
            </p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
