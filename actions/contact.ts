"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/auth/activity-log";
import { prisma } from "@/lib/prisma";
import type { ContactFormValues, InquiryFormValues } from "@/types/forms";

export async function submitContactForm(data: ContactFormValues) {
  const inquiry = await prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: `[${data.subject}]\n\n${data.message}`,
      inquiryType: "GENERAL",
      status: "NEW",
    },
  });

  await logActivity({
    action: "INQUIRY_CREATED",
    entityType: "Inquiry",
    entityId: inquiry.id,
    metadata: { source: "contact-form", name: data.name },
  });

  revalidatePath("/admin/inquiries");
  return { success: true };
}

export async function submitInquiryForm(data: InquiryFormValues) {
  const inquiryTypeMap = {
    buy: "BUY",
    rent: "RENT",
    sell: "SELL",
    general: "GENERAL",
  } as const;

  const property = data.propertyId
    ? await prisma.property.findUnique({ where: { id: data.propertyId } })
    : null;

  const inquiry = await prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      inquiryType: inquiryTypeMap[data.inquiryType],
      propertyId: property?.id,
      status: "NEW",
    },
  });

  await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: "website",
      status: "NEW",
      propertyId: property?.id,
      notes: data.propertyTitle ? `Interested in: ${data.propertyTitle}` : undefined,
    },
  });

  await logActivity({
    action: "LEAD_CREATED",
    entityType: "Lead",
    entityId: inquiry.id,
    metadata: { source: "inquiry-form", name: data.name },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/leads");
  return { success: true };
}

export async function submitPropertyInquiry(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string;
}) {
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
    select: { id: true, title: true, assignedAgentId: true },
  });

  if (!property) {
    return { success: false, error: "Property not found" };
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      inquiryType: "BUY",
      propertyId: property.id,
      status: "NEW",
    },
  });

  await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: "property-detail",
      status: "NEW",
      propertyId: property.id,
      assignedAgentId: property.assignedAgentId,
      notes: `Inquiry for: ${property.title}`,
    },
  });

  await logActivity({
    action: "INQUIRY_CREATED",
    entityType: "Inquiry",
    entityId: inquiry.id,
    metadata: { source: "property-detail", propertyTitle: property.title },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/leads");
  return { success: true };
}
