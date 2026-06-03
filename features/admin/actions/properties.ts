"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import { propertyFormSchema } from "@/features/admin/schemas";
import { logActivity, requirePermission } from "@/lib/auth";
import { revalidatePublicContent } from "@/lib/cache/revalidate-public";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getAdminProperties(search?: string, filters?: {
  published?: string;
  featured?: string;
  archived?: string;
}) {
  const user = await requirePermission("properties:view");

  const where: Prisma.PropertyWhereInput = {
    ...(user.role === "AGENT" ? { assignedAgentId: user.id } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
            { propertyId: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(filters?.published === "true" ? { published: true } : {}),
    ...(filters?.published === "false" ? { published: false } : {}),
    ...(filters?.featured === "true" ? { featured: true } : {}),
    ...(filters?.archived === "true" ? { archived: true } : {}),
    ...(filters?.archived !== "true" ? { archived: false } : {}),
  };

  return prisma.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      assignedAgent: { select: { name: true } },
    },
  }).then((rows) => rows.map(serializeProperty));
}

export async function getAdminProperty(id: string) {
  const user = await requirePermission("properties:view");
  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!property) return null;
  if (user.role === "AGENT" && property.assignedAgentId !== user.id) {
    throw new Error("Unauthorized");
  }
  return serializeProperty(property);
}

function parseSchemaData(json?: string | null) {
  if (!json?.trim()) return undefined;
  try {
    return JSON.parse(json) as object;
  } catch {
    throw new Error("Invalid JSON in schema data field");
  }
}

function normalizeAgentId(id?: string | null, fallback?: string | null) {
  if (id?.trim()) return id.trim();
  return fallback ?? null;
}

/** Prisma Decimal cannot cross the server → client boundary */
function serializeProperty<T extends { price: { toString(): string } | number }>(
  property: T
): Omit<T, "price"> & { price: number } {
  return {
    ...property,
    price:
      typeof property.price === "number"
        ? property.price
        : Number(property.price.toString()),
  };
}

export async function createProperty(input: unknown) {
  const user = await requirePermission("properties:create");
  const data = propertyFormSchema.parse(input);

  const property = await prisma.property.create({
    data: {
      propertyId: data.propertyId,
      title: data.title,
      slug: data.slug || slugify(data.title),
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      currency: data.currency,
      type: data.type,
      kind: data.kind,
      category: data.category,
      location: data.location,
      locationArea: data.locationArea,
      area: data.area,
      areaUnit: data.areaUnit,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      garage: data.garage,
      purpose: data.purpose,
      possessionStatus: data.possessionStatus,
      amenities: data.amenities,
      nearbyLandmarks: data.nearbyLandmarks,
      coordinates:
        data.lat && data.lng ? { lat: data.lat, lng: data.lng } : undefined,
      featured: data.featured,
      isNew: data.isNew,
      published: data.published,
      archived: data.archived,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      ogImage: data.ogImage,
      canonicalUrl: data.canonicalUrl,
      schemaData: parseSchemaData(data.schemaDataJson),
      assignedAgentId: normalizeAgentId(
        data.assignedAgentId,
        user.role === "AGENT" ? user.id : null
      ),
      images: {
        create: data.images.map((img) => ({
          url: img.url,
          alt: img.alt,
          order: img.order,
        })),
      },
    },
    include: { images: true },
  });

  await logActivity({
    userId: user.id,
    action: "PROPERTY_CREATED",
    entityType: "Property",
    entityId: property.id,
    metadata: { title: property.title },
  });

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  revalidatePublicContent({ properties: true, stats: true });
  return { id: property.id };
}

export async function updateProperty(id: string, input: unknown) {
  const user = await requirePermission("properties:edit");
  const data = propertyFormSchema.parse(input);

  const existing = await getAdminProperty(id);
  if (!existing) throw new Error("Property not found");

  await prisma.propertyImage.deleteMany({ where: { propertyId: id } });

  const property = await prisma.property.update({
    where: { id },
    data: {
      propertyId: data.propertyId,
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      currency: data.currency,
      type: data.type,
      kind: data.kind,
      category: data.category,
      location: data.location,
      locationArea: data.locationArea,
      area: data.area,
      areaUnit: data.areaUnit,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      garage: data.garage,
      purpose: data.purpose,
      possessionStatus: data.possessionStatus,
      amenities: data.amenities,
      nearbyLandmarks: data.nearbyLandmarks,
      coordinates:
        data.lat && data.lng ? { lat: data.lat, lng: data.lng } : undefined,
      featured: data.featured,
      isNew: data.isNew,
      published: data.published,
      archived: data.archived,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      ogImage: data.ogImage,
      canonicalUrl: data.canonicalUrl,
      schemaData: parseSchemaData(data.schemaDataJson),
      assignedAgentId: normalizeAgentId(data.assignedAgentId),
      images: {
        create: data.images.map((img) => ({
          url: img.url,
          alt: img.alt,
          order: img.order,
        })),
      },
    },
  });

  await logActivity({
    userId: user.id,
    action: "PROPERTY_UPDATED",
    entityType: "Property",
    entityId: property.id,
    metadata: { title: property.title },
  });

  revalidatePath("/admin/properties");
  revalidatePath(`/properties/${property.slug}`);
  revalidatePath("/properties");
  revalidatePublicContent({ properties: true, stats: true });
  return { id: property.id };
}

export async function deleteProperty(id: string) {
  const user = await requirePermission("properties:delete");
  const property = await getAdminProperty(id);
  if (!property) throw new Error("Not found");

  await prisma.property.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: "PROPERTY_DELETED",
    entityType: "Property",
    entityId: id,
    metadata: { title: property.title },
  });

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  revalidatePublicContent({ properties: true, stats: true });
}

export async function togglePropertyFeatured(id: string) {
  const user = await requirePermission("properties:feature");
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");

  const updated = await prisma.property.update({
    where: { id },
    data: { featured: !existing.featured },
  });

  await logActivity({
    userId: user.id,
    action: updated.featured ? "PROPERTY_FEATURED" : "PROPERTY_UNFEATURED",
    entityType: "Property",
    entityId: id,
  });

  revalidatePath("/admin/properties");
  revalidatePublicContent({ properties: true, stats: true });
  return { id: updated.id, featured: updated.featured };
}

export async function duplicateProperty(id: string) {
  const user = await requirePermission("properties:create");
  const original = await getAdminProperty(id);
  if (!original) throw new Error("Not found");

  const copy = await prisma.property.create({
    data: {
      propertyId: `${original.propertyId}-COPY-${Date.now().toString(36).slice(-4).toUpperCase()}`,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now().toString(36).slice(-4)}`,
      shortDescription: original.shortDescription,
      description: original.description,
      descriptionSections: original.descriptionSections ?? undefined,
      price: original.price,
      currency: original.currency,
      type: original.type,
      kind: original.kind,
      category: original.category,
      location: original.location,
      locationArea: original.locationArea,
      area: original.area,
      areaUnit: original.areaUnit,
      bedrooms: original.bedrooms,
      bathrooms: original.bathrooms,
      garage: original.garage,
      purpose: original.purpose,
      possessionStatus: original.possessionStatus,
      amenities: original.amenities,
      nearbyLandmarks: original.nearbyLandmarks,
      coordinates: original.coordinates ?? undefined,
      featured: false,
      isNew: true,
      published: false,
      archived: false,
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
      assignedAgentId: original.assignedAgentId,
      images: {
        create: original.images.map((img) => ({
          url: img.url,
          alt: img.alt,
          order: img.order,
        })),
      },
    },
  });

  await logActivity({
    userId: user.id,
    action: "PROPERTY_DUPLICATED",
    entityType: "Property",
    entityId: copy.id,
    metadata: { fromId: id },
  });

  revalidatePath("/admin/properties");
  revalidatePublicContent({ properties: true, stats: true });
  return { id: copy.id };
}

export async function archiveProperty(id: string) {
  const user = await requirePermission("properties:edit");
  await prisma.property.update({ where: { id }, data: { archived: true, published: false } });
  await logActivity({ userId: user.id, action: "PROPERTY_ARCHIVED", entityType: "Property", entityId: id });
  revalidatePath("/admin/properties");
  revalidatePublicContent({ properties: true, stats: true });
}

export async function generatePropertyId() {
  const count = await prisma.property.count();
  return `SMP-${String(count + 1).padStart(3, "0")}`;
}
