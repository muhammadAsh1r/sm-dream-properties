import type {
  AreaUnit,
  LocationArea,
  PossessionStatus,
  PropertyCategory,
  PropertyKind,
  PropertyType,
  Property as PrismaProperty,
  PropertyImage,
  Settings,
  User,
} from "@prisma/client";

import type {
  DescriptionSection,
  Property,
  PropertyAgent,
  PropertyCategory as FrontendCategory,
  PropertyKind as FrontendKind,
  PropertyLocationArea,
  PropertyStatus,
  AreaUnit as FrontendAreaUnit,
  PossessionStatus as FrontendPossession,
} from "@/types/property";

type PrismaPropertyRow = PrismaProperty & {
  images: PropertyImage[];
  assignedAgent?: Pick<User, "name" | "phone" | "email" | "avatarUrl"> | null;
};

const TYPE_TO_FRONT: Record<PropertyType, PropertyStatus> = {
  SALE: "sale",
  RENT: "rent",
};

const KIND_TO_FRONT: Record<PropertyKind, FrontendKind> = {
  RESIDENTIAL_PLOT: "residential-plot",
  COMMERCIAL_PLOT: "commercial-plot",
  HOUSE: "house",
  APARTMENT: "apartment",
  FARMHOUSE: "farmhouse",
};

const CATEGORY_TO_FRONT: Record<PropertyCategory, FrontendCategory> = {
  RESIDENTIAL: "residential",
  COMMERCIAL: "commercial",
  PLOT: "plot",
  INDUSTRIAL: "industrial",
};

const LOCATION_TO_FRONT: Record<LocationArea, PropertyLocationArea> = {
  FAISAL_TOWN: "faisal-town",
  FAISAL_HILLS: "faisal-hills",
  B17: "b17",
  ISLAMABAD: "islamabad",
};

const AREA_UNIT_TO_FRONT: Record<AreaUnit, FrontendAreaUnit> = {
  SQFT: "sqft",
  MARLA: "marla",
  KANAL: "kanal",
};

const POSSESSION_TO_FRONT: Record<PossessionStatus, FrontendPossession> = {
  READY: "ready",
  UNDER_CONSTRUCTION: "under-construction",
  BOOKING: "booking",
};

export const FRONT_TYPE_TO_PRISMA: Record<PropertyStatus, PropertyType> = {
  sale: "SALE",
  rent: "RENT",
};

export const FRONT_KIND_TO_PRISMA: Record<FrontendKind, PropertyKind> = {
  "residential-plot": "RESIDENTIAL_PLOT",
  "commercial-plot": "COMMERCIAL_PLOT",
  house: "HOUSE",
  apartment: "APARTMENT",
  farmhouse: "FARMHOUSE",
};

export const FRONT_LOCATION_TO_PRISMA: Record<PropertyLocationArea, LocationArea> = {
  "faisal-town": "FAISAL_TOWN",
  "faisal-hills": "FAISAL_HILLS",
  b17: "B17",
  islamabad: "ISLAMABAD",
};

function parseDescriptionSections(
  property: PrismaProperty
): DescriptionSection[] {
  if (property.descriptionSections && Array.isArray(property.descriptionSections)) {
    return property.descriptionSections as DescriptionSection[];
  }

  const text = property.description || property.shortDescription;
  if (!text) return [];

  return [{ heading: "Description", paragraphs: [text] }];
}

function parseCoordinates(
  coords: PrismaProperty["coordinates"]
): Property["coordinates"] {
  if (coords && typeof coords === "object" && "lat" in coords && "lng" in coords) {
    const c = coords as { lat?: number; lng?: number };
    if (typeof c.lat === "number" && typeof c.lng === "number") {
      return { lat: c.lat, lng: c.lng };
    }
  }
  return { lat: 33.6844, lng: 73.0479 };
}

function buildAgent(
  property: PrismaPropertyRow,
  settings: Settings | null | undefined
): PropertyAgent {
  const social = settings?.socialLinks as { facebook?: string } | null;
  void social;

  return {
    name: property.assignedAgent?.name ?? settings?.companyName ?? "SM Dream Advisor",
    designation: "Property Advisor",
    phone: property.assignedAgent?.phone ?? settings?.phone ?? "",
    email: property.assignedAgent?.email ?? settings?.email ?? "",
    whatsapp: settings?.whatsapp ?? settings?.phone ?? "",
    photoUrl: property.assignedAgent?.avatarUrl ?? "",
  };
}

export function mapPrismaPropertyToFrontend(
  property: PrismaPropertyRow,
  settings?: Settings | null
): Property {
  const images = property.images
    .sort((a, b) => a.order - b.order)
    .map((img) => img.url);

  return {
    id: property.id,
    propertyId: property.propertyId,
    title: property.title,
    slug: property.slug,
    shortDescription: property.shortDescription,
    descriptionSections: parseDescriptionSections(property),
    price: Number(property.price),
    currency: property.currency,
    status: TYPE_TO_FRONT[property.type],
    kind: KIND_TO_FRONT[property.kind],
    category: CATEGORY_TO_FRONT[property.category],
    location: property.location,
    locationArea: LOCATION_TO_FRONT[property.locationArea],
    area: property.area,
    areaUnit: AREA_UNIT_TO_FRONT[property.areaUnit],
    bedrooms: property.bedrooms ?? undefined,
    bathrooms: property.bathrooms ?? undefined,
    garage: property.garage ?? undefined,
    purpose: property.purpose,
    possessionStatus: POSSESSION_TO_FRONT[property.possessionStatus],
    featured: property.featured,
    isNew: property.isNew,
    images: images.length > 0 ? images : [],
    amenities: property.amenities,
    coordinates: parseCoordinates(property.coordinates),
    nearbyLandmarks: property.nearbyLandmarks,
    agent: buildAgent(property, settings),
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  };
}

export const propertyInclude = {
  images: { orderBy: { order: "asc" as const } },
  assignedAgent: {
    select: { name: true, phone: true, email: true, avatarUrl: true },
  },
} as const;
