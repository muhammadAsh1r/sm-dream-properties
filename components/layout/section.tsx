import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  spacing?: "sm" | "md" | "lg";
  muted?: boolean;
};

const spacingMap = {
  sm: "py-16 md:py-20",
  md: "py-20 md:py-28",
  lg: "py-24 md:py-32",
};

export function Section({
  className,
  spacing = "md",
  muted = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        spacingMap[spacing],
        muted && "bg-muted",
        className
      )}
      {...props}
    />
  );
}
