import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  accent?: "primary" | "gold" | "neutral";
  className?: string;
};

const accentStyles = {
  primary: "border-l-primary bg-gradient-to-br from-primary/[0.04] to-transparent",
  gold: "border-l-brand-accent bg-gradient-to-br from-brand-accent/[0.06] to-transparent",
  neutral: "border-l-secondary/40 bg-gradient-to-br from-muted/50 to-transparent",
};

const iconStyles = {
  primary: "bg-primary/10 text-primary",
  gold: "bg-brand-accent/15 text-brand-accent",
  neutral: "bg-secondary/10 text-secondary",
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "primary",
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 border-l-4 bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        accentStyles[accent],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {trend && (
            <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
          )}
        </div>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg",
            iconStyles[accent]
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
