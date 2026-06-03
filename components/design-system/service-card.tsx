import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { CardLift } from "@/components/motion/card-lift";
import { Typography } from "@/components/design-system/typography";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
};

export function ServiceCard({
  title,
  description,
  icon: Icon,
  href,
  className,
}: ServiceCardProps) {
  return (
    <CardLift className={cn("h-full", className)}>
      <Card className="group h-full border-border/80 py-0 shadow-card transition-shadow hover:shadow-card-hover">
        <Link href={href} className="flex h-full flex-col">
          <CardContent className="flex h-full flex-col gap-5 px-6 py-7">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary group-hover:text-secondary">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-3">
              <Typography as="h3" variant="h4" className="flex items-center gap-2">
                {title}
                <ArrowUpRight
                  className="size-4 translate-y-px opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Typography>
              <Typography variant="body" className="text-muted-foreground">
                {description}
              </Typography>
            </div>
          </CardContent>
        </Link>
      </Card>
    </CardLift>
  );
}
