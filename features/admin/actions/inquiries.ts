"use server";

import { revalidatePath } from "next/cache";

import { inquiryStatusSchema } from "@/features/admin/schemas";
import { logActivity, requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAdminInquiries(search?: string, status?: string) {
  await requirePermission("inquiries:view");

  return prisma.inquiry.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { message: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { title: true, slug: true, propertyId: true } },
    },
  });
}

export async function updateInquiryStatus(id: string, status: string) {
  const user = await requirePermission("inquiries:edit");
  const parsed = inquiryStatusSchema.parse(status);

  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: { status: parsed },
  });

  await logActivity({
    userId: user.id,
    action: "INQUIRY_STATUS_UPDATED",
    entityType: "Inquiry",
    entityId: id,
    metadata: { status: parsed },
  });

  revalidatePath("/admin/inquiries");
  return inquiry;
}
