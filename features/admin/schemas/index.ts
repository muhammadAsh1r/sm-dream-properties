import { z } from "zod";

export const propertyFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  propertyId: z.string().min(1, "Property ID is required"),
  shortDescription: z.string().min(10),
  description: z.string().default(""),
  price: z.coerce.number().positive("Price must be positive"),
  currency: z.string().default("PKR"),
  type: z.enum(["SALE", "RENT"]),
  kind: z.enum([
    "RESIDENTIAL_PLOT",
    "COMMERCIAL_PLOT",
    "HOUSE",
    "APARTMENT",
    "FARMHOUSE",
  ]),
  category: z.enum(["RESIDENTIAL", "COMMERCIAL", "PLOT", "INDUSTRIAL"]),
  location: z.string().min(3),
  locationArea: z.enum(["FAISAL_TOWN", "FAISAL_HILLS", "B17", "ISLAMABAD"]),
  area: z.coerce.number().positive(),
  areaUnit: z.enum(["SQFT", "MARLA", "KANAL"]),
  bedrooms: z.coerce.number().optional().nullable(),
  bathrooms: z.coerce.number().optional().nullable(),
  garage: z.coerce.number().optional().nullable(),
  purpose: z.string().default("Residential"),
  possessionStatus: z.enum(["READY", "UNDER_CONSTRUCTION", "BOOKING"]),
  amenities: z.array(z.string()).default([]),
  nearbyLandmarks: z.array(z.string()).default([]),
  lat: z.coerce.number().optional().nullable(),
  lng: z.coerce.number().optional().nullable(),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  published: z.boolean().default(false),
  archived: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  schemaDataJson: z.string().optional().nullable(),
  assignedAgentId: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v?.trim() ? v.trim() : null)),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    order: z.number(),
  })).default([]),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export const leadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "NEGOTIATING",
  "CLOSED",
  "LOST",
]);

export const inquiryStatusSchema = z.enum([
  "NEW",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
]);

export const blogPostSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().default(""),
  content: z.any(),
  featuredImage: z.string().optional().nullable(),
  published: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export const testimonialSchema = z.object({
  name: z.string().min(2),
  role: z.string().default(""),
  location: z.string().default(""),
  content: z.string().min(10),
  rating: z.coerce.number().min(1).max(5),
  photoUrl: z.string().optional().nullable(),
  approved: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

export const settingsSchema = z.object({
  companyName: z.string().min(1),
  tagline: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().email().or(z.literal("")),
  whatsapp: z.string().default(""),
  addressLine1: z.string().default(""),
  addressLine2: z.string().default(""),
  addressLine3: z.string().default(""),
  facebook: z.string().default(""),
  instagram: z.string().default(""),
  linkedin: z.string().default(""),
  mapLat: z.coerce.number().optional().nullable(),
  mapLng: z.coerce.number().optional().nullable(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const userRoleSchema = z.enum(["SUPER_ADMIN", "ADMIN", "AGENT", "CLIENT"]);
