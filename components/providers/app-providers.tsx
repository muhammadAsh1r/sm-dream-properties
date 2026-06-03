import { ClerkProvider } from "@clerk/nextjs";

import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { Toaster } from "@/components/ui/sonner";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ClerkProvider>
      <PostHogProvider>
        {children}
        <AnalyticsProvider />
        <Toaster position="top-right" richColors closeButton />
      </PostHogProvider>
    </ClerkProvider>
  );
}
