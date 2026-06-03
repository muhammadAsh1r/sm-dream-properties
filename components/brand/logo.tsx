import Link from "next/link";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/constants";

type LogoProps = {
  className?: string;
  variant?: "default" | "light";
};

export function Logo({ className, variant = "default" }: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-3", className)}
      aria-label={`${siteConfig.name} — Home`}
    >
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-lg font-heading text-sm font-bold tracking-tight transition-colors",
          isLight
            ? "bg-white/10 text-white ring-1 ring-white/20"
            : "bg-primary/10 text-primary ring-1 ring-primary/20"
        )}
        aria-hidden="true"
      >
        SM
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-base font-bold tracking-tight",
            isLight ? "text-white" : "text-foreground"
          )}
        >
          SM Dream
        </span>
        <span
          className={cn(
            "text-[0.65rem] font-medium uppercase tracking-[0.18em]",
            isLight ? "text-white/70" : "text-muted-foreground"
          )}
        >
          Properties
        </span>
      </span>
    </Link>
  );
}
