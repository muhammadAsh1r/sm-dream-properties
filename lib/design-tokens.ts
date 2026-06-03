/**
 * SM Dream Properties — Design Tokens
 * Single source of truth for brand values used in JS/TS contexts.
 */

export const colors = {
  primary: "#00C8FF",
  secondary: "#0A0A0A",
  accent: "#D4AF37",
  background: "#FFFFFF",
  muted: "#F8F9FA",
  border: "#E5E7EB",
  text: "#111827",
  textMuted: "#6B7280",
  white: "#FFFFFF",
} as const;

export const typography = {
  fonts: {
    heading: "var(--font-montserrat)",
    body: "var(--font-inter)",
  },
  scale: {
    hero: {
      size: "clamp(2.75rem, 5vw + 1rem, 4.5rem)",
      lineHeight: "1.05",
      letterSpacing: "-0.03em",
      weight: "700",
    },
    display: {
      size: "clamp(2.25rem, 3.5vw + 1rem, 3.5rem)",
      lineHeight: "1.1",
      letterSpacing: "-0.025em",
      weight: "700",
    },
    h1: {
      size: "clamp(2rem, 2.5vw + 1rem, 3rem)",
      lineHeight: "1.15",
      letterSpacing: "-0.02em",
      weight: "700",
    },
    h2: {
      size: "clamp(1.75rem, 2vw + 0.75rem, 2.25rem)",
      lineHeight: "1.2",
      letterSpacing: "-0.015em",
      weight: "600",
    },
    h3: {
      size: "clamp(1.375rem, 1.5vw + 0.5rem, 1.75rem)",
      lineHeight: "1.3",
      letterSpacing: "-0.01em",
      weight: "600",
    },
    h4: {
      size: "clamp(1.125rem, 1vw + 0.5rem, 1.375rem)",
      lineHeight: "1.4",
      letterSpacing: "-0.005em",
      weight: "600",
    },
    bodyLarge: {
      size: "1.125rem",
      lineHeight: "1.7",
      letterSpacing: "0",
      weight: "400",
    },
    body: {
      size: "1rem",
      lineHeight: "1.65",
      letterSpacing: "0",
      weight: "400",
    },
    small: {
      size: "0.875rem",
      lineHeight: "1.5",
      letterSpacing: "0.01em",
      weight: "400",
    },
  },
} as const;

export const spacing = {
  section: {
    sm: "4rem",
    md: "6rem",
    lg: "8rem",
  },
  container: {
    padding: "clamp(1rem, 4vw, 2rem)",
    maxWidth: "1280px",
    wideMaxWidth: "1440px",
  },
} as const;

export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
  md: "0 4px 12px -2px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
  lg: "0 12px 32px -8px rgb(0 0 0 / 0.08), 0 4px 8px -4px rgb(0 0 0 / 0.04)",
  card: "0 2px 16px -4px rgb(0 0 0 / 0.06)",
  cardHover: "0 16px 40px -12px rgb(0 0 0 / 0.12)",
} as const;

export const motion = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
  },
  ease: [0.22, 1, 0.36, 1] as const,
} as const;
