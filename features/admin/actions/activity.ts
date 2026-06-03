"use server";

import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 25;

export async function getActivityLogs(
  page = 1,
  filters?: { entityType?: string; q?: string }
) {
  await requirePermission("activity:view");

  const where = {
    ...(filters?.entityType ? { entityType: filters.entityType } : {}),
    ...(filters?.q
      ? {
          OR: [
            { action: { contains: filters.q, mode: "insensitive" as const } },
            { entityType: { contains: filters.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.activityLog.count({ where }),
  ]);

  return { logs, total, pageSize: PAGE_SIZE, page };
}

export async function getActivityEntityTypes(): Promise<string[]> {
  await requirePermission("activity:view");
  const rows = await prisma.activityLog.findMany({
    distinct: ["entityType"],
    select: { entityType: true },
    orderBy: { entityType: "asc" },
  });
  return rows.map((r) => r.entityType);
}
