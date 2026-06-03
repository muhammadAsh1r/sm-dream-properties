"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { leadStatusSchema } from "@/features/admin/schemas";
import { hasPermission, logActivity, requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { LeadStatus } from "@prisma/client";

async function requireLeadsAccess() {
  const user = await requireAdminUser();
  if (
    !hasPermission(user.role, "leads:view") &&
    !hasPermission(user.role, "leads:view_own")
  ) {
    redirect("/admin?error=unauthorized");
  }
  return user;
}

export async function getAdminLeads(search?: string, status?: string) {
  const user = await requireLeadsAccess();
  const isAgent = user.role === "AGENT";

  return prisma.lead.findMany({
    where: {
      ...(isAgent ? { assignedAgentId: user.id } : {}),
      ...(status ? { status: status as never } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { title: true, slug: true } },
      assignedAgent: { select: { name: true } },
    },
  });
}

export async function updateLeadStatus(id: string, status: string) {
  const user = await requireLeadsAccess();

  if (!hasPermission(user.role, "leads:edit")) {
    if (user.role !== "AGENT") redirect("/admin?error=unauthorized");
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing || existing.assignedAgentId !== user.id) {
      redirect("/admin?error=unauthorized");
    }
  }

  const parsed = leadStatusSchema.parse(status);
  const lead = await prisma.lead.update({
    where: { id },
    data: { status: parsed },
  });

  await logActivity({
    userId: user.id,
    action: "LEAD_STATUS_UPDATED",
    entityType: "Lead",
    entityId: id,
    metadata: { status: parsed },
  });

  revalidatePath("/admin/leads");
  return lead;
}

export async function updateLead(
  id: string,
  input: { notes?: string; assignedAgentId?: string | null; status?: string }
) {
  const user = await requireLeadsAccess();

  if (!hasPermission(user.role, "leads:edit")) {
    redirect("/admin?error=unauthorized");
  }

  const data: {
    notes?: string;
    assignedAgentId?: string | null;
    status?: LeadStatus;
  } = {};
  if (input.notes !== undefined) data.notes = input.notes;
  if (input.assignedAgentId !== undefined) data.assignedAgentId = input.assignedAgentId || null;
  if (input.status) data.status = leadStatusSchema.parse(input.status);

  const lead = await prisma.lead.update({ where: { id }, data });

  await logActivity({
    userId: user.id,
    action: "LEAD_UPDATED",
    entityType: "Lead",
    entityId: id,
    metadata: { name: lead.name },
  });

  revalidatePath("/admin/leads");
  return lead;
}

export async function createLead(input: {
  name: string;
  phone: string;
  email?: string;
  source?: string;
  propertyId?: string;
  assignedAgentId?: string;
}) {
  const user = await requireAdminUser();
  if (!hasPermission(user.role, "leads:edit")) {
    redirect("/admin?error=unauthorized");
  }

  const lead = await prisma.lead.create({
    data: {
      ...input,
      assignedAgentId: input.assignedAgentId || null,
    },
  });

  await logActivity({
    userId: user.id,
    action: "LEAD_CREATED",
    entityType: "Lead",
    entityId: lead.id,
    metadata: { name: lead.name },
  });

  revalidatePath("/admin/leads");
  return lead;
}
