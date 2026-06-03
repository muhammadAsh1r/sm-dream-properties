"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { cardLiftVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

type CardLiftProps = HTMLMotionProps<"div">;

export function CardLift({ className, children, ...props }: CardLiftProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={cardLiftVariants}
      className={cn("rounded-xl", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
