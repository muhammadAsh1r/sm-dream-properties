import { auth, currentUser } from "@clerk/nextjs/server";
import type { User } from "@prisma/client";
import { redirect } from "next/navigation";

import {
  canAccessAdmin,
  hasPermission,
  type Permission,
} from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function syncUserFromClerk(): Promise<User | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

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

  return prisma.user.upsert({
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
      ...(role ? { role } : {}),
    },
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    user = await syncUserFromClerk();
  }
  return user;
}

export async function requireAdminUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user || !canAccessAdmin(user.role)) {
    redirect("/sign-in?redirect_url=/admin");
  }
  if (!user.active) {
    redirect("/sign-in?error=account_deactivated");
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
