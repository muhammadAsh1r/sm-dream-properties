"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { scaleHoverVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

type ScaleHoverProps = HTMLMotionProps<"div">;

export function ScaleHover({ className, children, ...props }: ScaleHoverProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={scaleHoverVariants}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
