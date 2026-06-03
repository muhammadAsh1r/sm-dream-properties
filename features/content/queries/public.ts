import type { Settings, Testimonial } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache as reactCache } from "react";

import { CACHE_TAGS } from "@/lib/cache/tags";
import { withDbFallback } from "@/lib/db/safe-query";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/constants";
import type { Testimonial as FrontendTestimonial } from "@/types/service";

export type PublicSiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  address: {
    line1: string;
    line2: string;
    line3: string;
    full: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
};

export type PublicSiteStats = {
  propertiesListed: number;
  featuredProperties: number;
  happyClients: number;
  testimonials: number;
};

function parseAddress(settings: Settings | null) {
  const fallback = siteConfig.location.address;
  if (!settings?.address || typeof settings.address !== "object") {
    return {
      line1: fallback.line1,
      line2: fallback.line2,
      line3: fallback.line3,
      full: siteConfig.location.full,
    };
  }
  const a = settings.address as { line1?: string; line2?: string; line3?: string };
  const line1 = a.line1 ?? fallback.line1;
  const line2 = a.line2 ?? fallback.line2;
  const line3 = a.line3 ?? fallback.line3;
  return {
    line1,
    line2,
    line3,
    full: [line1, line2, line3].filter(Boolean).join(", "),
  };
}

function parseSocial(settings: Settings | null) {
  const fallback = siteConfig.social;
  if (!settings?.socialLinks || typeof settings.socialLinks !== "object") {
    return { ...fallback };
  }
  const s = settings.socialLinks as {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  return {
    facebook: s.facebook ?? fallback.facebook,
    instagram: s.instagram ?? fallback.instagram,
    linkedin: s.linkedin ?? fallback.linkedin,
  };
}

async function fetchPublicSettings(): Promise<Settings | null> {
  return withDbFallback(
    () => prisma.settings.findUnique({ where: { id: "global" } }),
    null,
    "public settings"
  );
}

const getSettingsFromCache = unstable_cache(
  fetchPublicSettings,
  ["public-settings"],
  { revalidate: 300, tags: [CACHE_TAGS.settings] }
);

/** Settings — cached across requests; deduped within a single render. */
export const getPublicSettings = reactCache(getSettingsFromCache);

export const getPublicSiteConfig = reactCache(async (): Promise<PublicSiteConfig> => {
  const settings = await getPublicSettings();
  const address = parseAddress(settings);

  return {
    name: settings?.companyName ?? siteConfig.name,
    tagline: settings?.tagline ?? siteConfig.tagline,
    description: settings?.tagline
      ? `${settings.tagline} — ${siteConfig.description.split(".")[0]}.`
      : siteConfig.description,
    url: process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url,
    contact: {
      phone: settings?.phone ?? siteConfig.contact.phone,
      email: settings?.email ?? siteConfig.contact.email,
      whatsapp: settings?.whatsapp ?? siteConfig.contact.whatsapp,
    },
    address,
    social: parseSocial(settings),
  };
});

export const getPublicTestimonials = unstable_cache(
  async (): Promise<FrontendTestimonial[]> => {
    return withDbFallback(
      async () => {
        const rows = await prisma.testimonial.findMany({
          where: { approved: true },
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        });
        return rows.map(mapTestimonial);
      },
      [],
      "public testimonials"
    );
  },
  ["public-testimonials"],
  { revalidate: 120, tags: [CACHE_TAGS.testimonials] }
);

function mapTestimonial(row: Testimonial): FrontendTestimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role || row.location || "Client",
    content: row.content,
    avatarUrl: row.photoUrl ?? undefined,
    rating: row.rating,
  };
}

export type PublicTeamMember = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: string;
};

export const getPublicTeamMembers = unstable_cache(
  async (): Promise<PublicTeamMember[]> => {
    return withDbFallback(
      () =>
        prisma.user.findMany({
          where: {
            active: true,
            role: { in: ["AGENT", "ADMIN", "SUPER_ADMIN"] },
          },
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
          orderBy: [{ role: "asc" }, { name: "asc" }],
          take: 12,
        }),
      [],
      "public team"
    );
  },
  ["public-team"],
  { revalidate: 300, tags: [CACHE_TAGS.team] }
);

export const getPublicSiteStats = unstable_cache(
  async (): Promise<PublicSiteStats> => {
    return withDbFallback(
      async () => {
        const [propertiesListed, featuredProperties, happyClients, testimonials] =
          await Promise.all([
            prisma.property.count({ where: { published: true, archived: false } }),
            prisma.property.count({
              where: { published: true, archived: false, featured: true },
            }),
            prisma.lead.count({ where: { status: "CLOSED" } }),
            prisma.testimonial.count({ where: { approved: true } }),
          ]);

        return {
          propertiesListed,
          featuredProperties,
          happyClients,
          testimonials,
        };
      },
      {
        propertiesListed: 0,
        featuredProperties: 0,
        happyClients: 0,
        testimonials: 0,
      },
      "public site stats"
    );
  },
  ["public-site-stats"],
  { revalidate: 120, tags: [CACHE_TAGS.stats] }
);
