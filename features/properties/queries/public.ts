import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache as reactCache } from "react";

import {
  FRONT_KIND_TO_PRISMA,
  FRONT_LOCATION_TO_PRISMA,
  FRONT_TYPE_TO_PRISMA,
  mapPrismaPropertyToFrontend,
  propertyInclude,
} from "@/features/properties/lib/property-mapper";
import { AREA_PRESETS, PROPERTIES_PER_PAGE } from "@/features/properties/data/filter-options";
import { getPublicSettings } from "@/features/content/queries/public";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { prisma } from "@/lib/prisma";
import type {
  Property,
  PropertyKind,
  PropertyLocationArea,
  PropertySearchParams,
  PropertySort,
  PropertyStatus,
} from "@/types/property";

const publishedWhere: Prisma.PropertyWhereInput = {
  published: true,
  archived: false,
};

function toMarla(area: number, unit: Property["areaUnit"]): number {
  if (unit === "marla") return area;
  if (unit === "kanal") return area * 20;
  return area / 272;
}

function matchesAreaFilter(
  property: Property,
  areaPreset?: string,
  customMin?: string,
  customMax?: string
): boolean {
  if (!areaPreset) return true;

  const marla = toMarla(property.area, property.areaUnit);

  if (areaPreset === "custom") {
    const min = customMin ? Number(customMin) : 0;
    const max = customMax ? Number(customMax) : Infinity;
    return marla >= min && marla <= max;
  }

  const preset = AREA_PRESETS.find((p) => p.value === areaPreset);
  if (!preset || preset.marla === null) return true;

  const tolerance = preset.marla * 0.05;
  return Math.abs(marla - preset.marla) <= tolerance;
}

function getDbOrderBy(sort: PropertySort): Prisma.PropertyOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }];
    case "price-desc":
      return [{ price: "desc" }];
    case "featured":
      return [{ featured: "desc" }, { createdAt: "desc" }];
    case "latest":
    default:
      return [{ createdAt: "desc" }];
  }
}

function buildPrismaWhere(params: PropertySearchParams): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = { ...publishedWhere };

  if (params.featured === "true") where.featured = true;
  if (params.kind) {
    where.kind = FRONT_KIND_TO_PRISMA[params.kind as PropertyKind];
  }
  if (params.status) {
    where.type = FRONT_TYPE_TO_PRISMA[params.status as PropertyStatus];
  }
  if (params.location) {
    where.locationArea =
      FRONT_LOCATION_TO_PRISMA[params.location as PropertyLocationArea];
  }
  if (params.minPrice || params.maxPrice) {
    const priceFilter: Prisma.DecimalFilter = {};
    if (params.minPrice) priceFilter.gte = Number(params.minPrice);
    if (params.maxPrice) priceFilter.lte = Number(params.maxPrice);
    where.price = priceFilter;
  }
  if (params.bedrooms) where.bedrooms = { gte: Number(params.bedrooms) };
  if (params.bathrooms) where.bathrooms = { gte: Number(params.bathrooms) };
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { location: { contains: params.q, mode: "insensitive" } },
      { shortDescription: { contains: params.q, mode: "insensitive" } },
      { propertyId: { contains: params.q, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function searchPublishedProperties(params: PropertySearchParams = {}) {
  const settings = await getPublicSettings();
  const where = buildPrismaWhere(params);
  const sort = (params.sort as PropertySort) ?? "latest";
  const currentPage = Math.max(1, Number(params.page) || 1);
  const hasAreaFilter = Boolean(params.area);

  if (!hasAreaFilter) {
    const [rows, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: propertyInclude,
        orderBy: getDbOrderBy(sort),
        skip: (currentPage - 1) * PROPERTIES_PER_PAGE,
        take: PROPERTIES_PER_PAGE,
      }),
      prisma.property.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / PROPERTIES_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);

    return {
      properties: rows.map((row) => mapPrismaPropertyToFrontend(row, settings)),
      total,
      totalPages,
      page: safePage,
      perPage: PROPERTIES_PER_PAGE,
    };
  }

  const rows = await prisma.property.findMany({
    where,
    include: propertyInclude,
    orderBy: { createdAt: "desc" },
  });

  let properties = rows.map((row) => mapPrismaPropertyToFrontend(row, settings));
  properties = properties.filter((p) =>
    matchesAreaFilter(p, params.area, params.customAreaMin, params.customAreaMax)
  );

  if (sort === "price-asc") properties.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") properties.sort((a, b) => b.price - a.price);
  else if (sort === "featured") {
    properties.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  const total = properties.length;
  const totalPages = Math.max(1, Math.ceil(total / PROPERTIES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PROPERTIES_PER_PAGE;

  return {
    properties: properties.slice(start, start + PROPERTIES_PER_PAGE),
    total,
    totalPages,
    page: safePage,
    perPage: PROPERTIES_PER_PAGE,
  };
}

async function fetchPropertyBySlug(slug: string) {
  const settings = await getPublicSettings();
  const row = await prisma.property.findFirst({
    where: { ...publishedWhere, slug },
    include: propertyInclude,
  });

  if (!row) return null;
  return mapPrismaPropertyToFrontend(row, settings);
}

export const getPublishedPropertyBySlug = reactCache(async (slug: string) => {
  return unstable_cache(
    () => fetchPropertyBySlug(slug),
    [`property-slug-${slug}`],
    { revalidate: 60, tags: [CACHE_TAGS.properties] }
  )();
});

export async function getFeaturedPublishedProperties(limit = 6) {
  return unstable_cache(
    async () => {
      const settings = await getPublicSettings();
      const rows = await prisma.property.findMany({
        where: publishedWhere,
        include: propertyInclude,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: limit,
      });

      return rows.map((row) => mapPrismaPropertyToFrontend(row, settings));
    },
    ["featured-properties", String(limit)],
    { revalidate: 60, tags: [CACHE_TAGS.properties] }
  )();
}

export async function getSimilarPublishedProperties(property: Property, limit = 4) {
  const settings = await getPublicSettings();
  const locationArea = FRONT_LOCATION_TO_PRISMA[property.locationArea];
  const kind = FRONT_KIND_TO_PRISMA[property.kind];

  const rows = await prisma.property.findMany({
    where: {
      ...publishedWhere,
      id: { not: property.id },
      OR: [{ locationArea }, { kind }],
    },
    include: propertyInclude,
    orderBy: { createdAt: "desc" },
    take: 16,
  });

  const all = rows.map((row) => mapPrismaPropertyToFrontend(row, settings));

  const scored = all.map((p) => {
    let score = 0;
    if (p.locationArea === property.locationArea) score += 3;
    if (p.kind === property.kind) score += 2;
    if (p.status === property.status) score += 1;
    const priceDiff = Math.abs(p.price - property.price) / Math.max(property.price, 1);
    if (priceDiff < 0.3) score += 2;
    else if (priceDiff < 0.5) score += 1;
    return { property: p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.property);
}

export async function getPublishedPropertySlugs(): Promise<string[]> {
  const rows = await prisma.property.findMany({
    where: publishedWhere,
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getPublishedPropertyCount() {
  return prisma.property.count({ where: publishedWhere });
}
