"use client";

import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useState } from "react";
import type { PostHog } from "posthog-js";

import { analyticsConfig } from "@/lib/analytics";

type PostHogProviderProps = {
  children: React.ReactNode;
};

export function PostHogProvider({ children }: PostHogProviderProps) {
  const [client, setClient] = useState<PostHog | null>(null);

  useEffect(() => {
    if (!analyticsConfig.posthogKey) return;

    let cancelled = false;

    const init = () => {
      void import("posthog-js").then(({ default: posthog }) => {
        if (cancelled) return;
        posthog.init(analyticsConfig.posthogKey!, {
          api_host: analyticsConfig.posthogHost,
          person_profiles: "identified_only",
          capture_pageview: false,
        });
        setClient(posthog);
      });
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(init, { timeout: 3000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timer = globalThis.setTimeout(init, 1500);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timer);
    };
  }, []);

  if (!analyticsConfig.posthogKey || !client) {
    return <>{children}</>;
  }

  return <PHProvider client={client}>{children}</PHProvider>;
}
