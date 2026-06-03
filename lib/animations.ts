import type { Transition, Variants } from "framer-motion";

import { motion as motionTokens } from "@/lib/design-tokens";

const premiumEase = motionTokens.ease;

export const premiumTransition: Transition = {
  duration: motionTokens.duration.normal,
  ease: premiumEase,
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: premiumTransition,
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motionTokens.duration.slow, ease: premiumEase },
  },
};

export const scaleHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: motionTokens.duration.fast, ease: premiumEase },
  },
};

export const cardLiftVariants: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 2px 16px -4px rgb(0 0 0 / 0.06)",
  },
  hover: {
    y: -6,
    boxShadow: "0 16px 40px -12px rgb(0 0 0 / 0.12)",
    transition: { duration: motionTokens.duration.normal, ease: premiumEase },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const navbarVariants: Variants = {
  top: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    boxShadow: "none",
  },
  scrolled: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 1px 0 0 rgb(229 231 235 / 0.8)",
    backdropFilter: "blur(12px)",
  },
};
