import type { User } from "@prisma/client";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import { getClerkAuth, getClerkUser } from "@/lib/auth/clerk-session";
import {
  canAccessAdmin,
  hasPermission,
  type Permission,
} from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function syncUserFromClerk(clerkUserId: string): Promise<User | null> {
  try {
    const clerkUser = await getClerkUser(clerkUserId);

    const email =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) return null;

    const roleFromMetadata = clerkUser.publicMetadata?.role as string | undefined;
    const validRoles = ["SUPER_ADMIN", "ADMIN", "AGENT", "CLIENT"] as const;
    const role =
      roleFromMetadata && validRoles.includes(roleFromMetadata as (typeof validRoles)[number])
        ? (roleFromMetadata as (typeof validRoles)[number])
        : undefined;

    return await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      create: {
        clerkId: clerkUser.id,
        email,
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
        avatarUrl: clerkUser.imageUrl ?? null,
        role: role ?? "CLIENT",
      },
      update: {
        email,
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
        avatarUrl: clerkUser.imageUrl ?? null,
        ...(role ? { role: role } : {}),
      },
    });
  } catch (error) {
    console.error("[auth] Failed to sync Clerk user to database:", error);
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await getClerkAuth();
  if (!userId) return null;

  try {
    let user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      user = await syncUserFromClerk(userId);
    }
    return user;
  } catch (error) {
    console.error("[auth] Database error during getCurrentUser:", error);
    return null;
  }
}

export async function requireAdminUser(): Promise<User> {
  const { userId } = await getClerkAuth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  let user: User | null = null;

  try {
    user =
      (await syncUserFromClerk(userId)) ??
      (await prisma.user.findUnique({ where: { clerkId: userId } }));
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[auth] Database error during admin auth:", error);
    redirect("/access-denied?reason=db");
  }

  if (!user || !canAccessAdmin(user.role)) {
    redirect("/access-denied");
  }
  if (!user.active) {
    redirect("/access-denied?reason=deactivated");
  }
  return user;
}

export async function requirePermission(permission: Permission): Promise<User> {
  const user = await requireAdminUser();
  if (!hasPermission(user.role, permission)) {
    redirect("/admin?error=unauthorized");
  }
  return user;
}
