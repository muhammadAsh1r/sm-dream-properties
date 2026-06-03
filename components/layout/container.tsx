import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & {
  wide?: boolean;
};

export function Container({
  className,
  wide = false,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        wide ? "max-w-[1440px]" : "max-w-7xl",
        className
      )}
      {...props}
    />
  );
}
