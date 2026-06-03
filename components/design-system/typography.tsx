import { cn } from "@/lib/utils";

const typographyStyles = {
  hero: "font-heading text-hero font-bold tracking-tight text-foreground",
  display: "font-heading text-display font-bold tracking-tight text-foreground",
  h1: "font-heading text-h1 font-bold tracking-tight text-foreground",
  h2: "font-heading text-h2 font-semibold tracking-tight text-foreground",
  h3: "font-heading text-h3 font-semibold tracking-tight text-foreground",
  h4: "font-heading text-h4 font-semibold text-foreground",
  bodyLarge: "text-body-lg text-foreground/90",
  body: "text-body text-foreground/85",
  small: "text-body-sm text-muted-foreground",
  eyebrow:
    "text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent",
} as const;

type TypographyVariant = keyof typeof typographyStyles;

type TypographyProps<T extends React.ElementType = "p"> = {
  as?: T;
  variant?: TypographyVariant;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Typography<T extends React.ElementType = "p">({
  as,
  variant = "body",
  className,
  children,
  ...props
}: TypographyProps<T>) {
  const Component = as ?? defaultElement[variant];

  return (
    <Component className={cn(typographyStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}

const defaultElement: Record<TypographyVariant, React.ElementType> = {
  hero: "h1",
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  bodyLarge: "p",
  body: "p",
  small: "p",
  eyebrow: "p",
};

export { typographyStyles };
