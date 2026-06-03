"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { fadeInVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function FadeIn({ className, delay = 0, ...props }: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeInVariants}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    />
  );
}
