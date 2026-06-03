"use server";

import { revalidatePath } from "next/cache";
import { startOfMonth, subMonths, format } from "date-fns";

import { getCurrentUser } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      totalProperties: 0,
      featuredProperties: 0,
      newLeads: 0,
      totalInquiries: 0,
      blogPosts: 0,
      testimonials: 0,
      publishedProperties: 0,
    };
  }

  const agentFilter =
    user.role === "AGENT" ? { assignedAgentId: user.id } : {};

  const [
    totalProperties,
    featuredProperties,
    newLeads,
    totalInquiries,
    blogPosts,
    testimonials,
    publishedProperties,
  ] = await Promise.all([
    prisma.property.count({ where: { archived: false, ...agentFilter } }),
    prisma.property.count({ where: { featured: true, archived: false, ...agentFilter } }),
    prisma.lead.count({
      where: {
        status: "NEW",
        ...(user.role === "AGENT" ? { assignedAgentId: user.id } : {}),
      },
    }),
    prisma.inquiry.count({
      where: user.role === "AGENT" ? { status: "NEW" } : {},
    }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.testimonial.count({ where: { approved: true } }),
    prisma.property.count({ where: { published: true, archived: false, ...agentFilter } }),
  ]);

  return {
    totalProperties,
    featuredProperties,
    newLeads,
    totalInquiries,
    blogPosts,
    testimonials,
    publishedProperties,
  };
}

export async function getDashboardCharts() {
  const user = await getCurrentUser();
  if (!user) return [];

  const agentPropertyFilter =
    user.role === "AGENT" ? { assignedAgentId: user.id } : {};
  const agentLeadFilter =
    user.role === "AGENT" ? { assignedAgentId: user.id } : {};

  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(startOfMonth(new Date()), 5 - i);
    return { date, label: format(date, "MMM yyyy") };
  });

  const [properties, leads, inquiries] = await Promise.all([
    prisma.property.findMany({
      where: {
        createdAt: { gte: months[0].date },
        ...agentPropertyFilter,
      },
      select: { createdAt: true },
    }),
    prisma.lead.findMany({
      where: { createdAt: { gte: months[0].date }, ...agentLeadFilter },
      select: { createdAt: true },
    }),
    prisma.inquiry.findMany({
      where: { createdAt: { gte: months[0].date } },
      select: { createdAt: true },
    }),
  ]);

  const chartData = months.map(({ date, label }) => {
    const monthStart = date.getTime();
    const nextMonth = subMonths(date, -1).getTime();

    return {
      month: label,
      properties: properties.filter((p) => {
        const t = p.createdAt.getTime();
        return t >= monthStart && t < nextMonth;
      }).length,
      leads: leads.filter((l) => {
        const t = l.createdAt.getTime();
        return t >= monthStart && t < nextMonth;
      }).length,
      inquiries: inquiries.filter((i) => {
        const t = i.createdAt.getTime();
        return t >= monthStart && t < nextMonth;
      }).length,
    };
  });

  return chartData;
}

export async function getRecentActivityLogs() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "activity:view")) {
    return [];
  }
  return prisma.activityLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });
}
