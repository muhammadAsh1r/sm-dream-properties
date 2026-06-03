import type { Metadata } from "next";

import {
  getPublicSettings,
  getPublicSiteConfig,
} from "@/features/content/queries/public";
import { ContactPageContent } from "@/features/contact/components/contact-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteConfig();
  return {
    title: "Contact Us",
    description: `Get in touch with ${site.name}. Call, email, or WhatsApp our team for property inquiries in Faisal Town and Islamabad.`,
    openGraph: {
      title: `Contact | ${site.name}`,
      description: site.description,
      url: `${site.url}/contact`,
    },
    alternates: {
      canonical: `${site.url}/contact`,
    },
  };
}

export default async function ContactPage() {
  const [site, settings] = await Promise.all([
    getPublicSiteConfig(),
    getPublicSettings(),
  ]);

  const mapCoords = settings?.mapCoordinates as
    | { lat?: number; lng?: number }
    | null
    | undefined;

  return (
    <ContactPageContent site={site} mapCoords={mapCoords ?? null} />
  );
}
