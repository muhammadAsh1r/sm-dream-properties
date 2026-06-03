export const analyticsConfig = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  posthogHost:
    process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
} as const;

export function isAnalyticsEnabled() {
  return Boolean(
    analyticsConfig.googleAnalyticsId || analyticsConfig.posthogKey
  );
}

export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, string | number | boolean>;
};

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  void event;
  // PostHog capture is handled in the PostHog provider.
}
