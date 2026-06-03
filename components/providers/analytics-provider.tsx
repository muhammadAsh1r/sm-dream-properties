import { GoogleAnalytics } from "@next/third-parties/google";

import { analyticsConfig } from "@/lib/analytics";

export function AnalyticsProvider() {
  if (!analyticsConfig.googleAnalyticsId) return null;

  return <GoogleAnalytics gaId={analyticsConfig.googleAnalyticsId} />;
}
