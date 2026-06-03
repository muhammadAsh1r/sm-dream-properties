"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";

import { settingsSchema, userRoleSchema } from "@/features/admin/schemas";
import { logActivity, requirePermission } from "@/lib/auth";
import { ROLE_HIERARCHY } from "@/lib/auth/permissions";
import { revalidatePublicContent } from "@/lib/cache/revalidate-public";
import { prisma } from "@/lib/prisma";

export async function getAdminUsers(search?: string) {
  await requirePermission("users:view");
  return prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(id: string, role: string) {
  const actor = await requirePermission("users:edit");
  const parsed = userRoleSchema.parse(role);

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw new Error("Not found");

  if (target.id === actor.id) {
    throw new Error("You cannot change your own role");
  }

  if (parsed === "SUPER_ADMIN" && actor.role !== "SUPER_ADMIN") {
    throw new Error("Only Super Admins can assign the Super Admin role");
  }

  if (ROLE_HIERARCHY[parsed] > ROLE_HIERARCHY[actor.role]) {
    throw new Error("You cannot assign a role higher than your own");
  }

  const updated = await prisma.user.update({ where: { id }, data: { role: parsed } });

  if (target.clerkId) {
    const client = await clerkClient();
    await client.users.updateUserMetadata(target.clerkId, {
      publicMetadata: { role: parsed },
    });
  }

  await logActivity({
    userId: actor.id,
    action: "USER_ROLE_UPDATED",
    entityType: "User",
    entityId: id,
    metadata: { role: parsed },
  });

  revalidatePath("/admin/users");
  return updated;
}

export async function toggleUserActive(id: string) {
  const user = await requirePermission("users:edit");
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");
  const updated = await prisma.user.update({
    where: { id },
    data: { active: !existing.active },
  });

  await logActivity({
    userId: user.id,
    action: updated.active ? "USER_ACTIVATED" : "USER_DEACTIVATED",
    entityType: "User",
    entityId: id,
  });

  revalidatePath("/admin/users");
  return updated;
}

export async function inviteTeamMember(email: string, role: "AGENT" | "ADMIN") {
  const user = await requirePermission("users:edit");

  const client = await clerkClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await client.invitations.createInvitation({
    emailAddress: email,
    publicMetadata: { role },
    redirectUrl: `${appUrl}/sign-up`,
  });

  await logActivity({
    userId: user.id,
    action: "USER_INVITED",
    entityType: "User",
    metadata: { email, role },
  });

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function getSettings() {
  await requirePermission("settings:view");
  let settings = await prisma.settings.findUnique({ where: { id: "global" } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "global" } });
  }
  return settings;
}

export async function updateSettings(input: unknown) {
  const user = await requirePermission("settings:edit");
  const data = settingsSchema.parse(input);

  const settings = await prisma.settings.upsert({
    where: { id: "global" },
    create: {
      id: "global",
      companyName: data.companyName,
      tagline: data.tagline,
      phone: data.phone,
      email: data.email,
      whatsapp: data.whatsapp,
      address: {
        line1: data.addressLine1,
        line2: data.addressLine2,
        line3: data.addressLine3,
      },
      socialLinks: {
        facebook: data.facebook,
        instagram: data.instagram,
        linkedin: data.linkedin,
      },
      mapCoordinates:
        data.mapLat && data.mapLng
          ? { lat: data.mapLat, lng: data.mapLng }
          : undefined,
    },
    update: {
      companyName: data.companyName,
      tagline: data.tagline,
      phone: data.phone,
      email: data.email,
      whatsapp: data.whatsapp,
      address: {
        line1: data.addressLine1,
        line2: data.addressLine2,
        line3: data.addressLine3,
      },
      socialLinks: {
        facebook: data.facebook,
        instagram: data.instagram,
        linkedin: data.linkedin,
      },
      mapCoordinates:
        data.mapLat && data.mapLng
          ? { lat: data.mapLat, lng: data.mapLng }
          : undefined,
    },
  });

  await logActivity({
    userId: user.id,
    action: "SETTINGS_UPDATED",
    entityType: "Settings",
    entityId: "global",
  });

  revalidatePath("/admin/settings");
  revalidatePublicContent({ settings: true, layout: true, team: true });
  revalidatePath("/contact");
  revalidatePath("/about");
  return settings;
}

export async function getAgents() {
  return prisma.user.findMany({
    where: { role: { in: ["AGENT", "ADMIN", "SUPER_ADMIN"] }, active: true },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}
