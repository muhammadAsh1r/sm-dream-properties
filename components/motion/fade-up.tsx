"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { fadeUpVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

type FadeUpProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function FadeUp({ className, delay = 0, ...props }: FadeUpProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUpVariants}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    />
  );
}
