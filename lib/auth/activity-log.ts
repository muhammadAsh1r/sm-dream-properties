import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type LogActivityInput = {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
};

export async function logActivity(input: LogActivityInput) {
  try {
    await prisma.activityLog.create({ data: input });
  } catch {
    // Non-blocking — don't fail mutations if logging fails
  }
}

export async function getRecentActivity(limit = 20) {
  return prisma.activityLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });
}
