import type { Metadata, Viewport } from "next";

import { SiteLayout } from "@/components/layout/site-layout";
import { AppProviders } from "@/components/providers/app-providers";
import { getPublicSiteConfig } from "@/features/content/queries/public";
import { siteConfig } from "@/lib/constants";
import { fontVariables } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "real estate",
    "Islamabad",
    "Faisal Town",
    "property",
    "logistics",
    "SM Dream Properties",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#00C8FF",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getPublicSiteConfig();

  return (
    <html lang="en">
      <body className={`${fontVariables} min-h-screen bg-background font-sans text-foreground antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-secondary"
        >
          Skip to main content
        </a>
        <AppProviders>
          <SiteLayout site={site}>{children}</SiteLayout>
        </AppProviders>
      </body>
    </html>
  );
}
