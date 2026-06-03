import Link from "next/link";
import { Suspense } from "react";
import {
  Building2,
  CheckCircle2,
  FileText,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";

import {
  getDashboardCharts,
  getDashboardStats,
  getRecentActivityLogs,
} from "@/features/admin/actions/dashboard";
import { DashboardCharts } from "@/features/admin/components/dashboard/dashboard-charts";
import { KpiCard } from "@/features/admin/components/dashboard/kpi-card";
import { AdminAlertBanner } from "@/features/admin/components/shared/admin-alert-banner";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";
import { ActivityLogFeed } from "@/features/admin/components/shared/activity-log-feed";
import { getCurrentUser } from "@/lib/auth";
import { hasPermission, ROLE_LABELS } from "@/lib/auth/permissions";

export default async function AdminDashboardPage() {
  const [stats, chartData, activity, user] = await Promise.all([
    getDashboardStats(),
    getDashboardCharts(),
    getRecentActivityLogs(),
    getCurrentUser(),
  ]);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const canViewActivity = hasPermission(user?.role ?? "CLIENT", "activity:view");

  return (
    <div>
      <Suspense>
        <AdminAlertBanner />
      </Suspense>

      <AdminPageHeader
        title={`Welcome back, ${firstName}`}
        description={`${ROLE_LABELS[user?.role ?? "CLIENT"]} · Overview of properties, leads, and content`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        <KpiCard label="Total Properties" value={stats.totalProperties} icon={Building2} accent="primary" />
        <KpiCard label="Published" value={stats.publishedProperties} icon={CheckCircle2} accent="primary" />
        <KpiCard label="Featured" value={stats.featuredProperties} icon={Star} accent="gold" />
        <KpiCard label="New Leads" value={stats.newLeads} icon={Users} accent="gold" />
        <KpiCard label="Inquiries" value={stats.totalInquiries} icon={MessageSquare} accent="neutral" />
        <KpiCard label="Blog Posts" value={stats.blogPosts} icon={FileText} accent="primary" />
        <KpiCard label="Testimonials" value={stats.testimonials} icon={Star} accent="gold" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCharts data={chartData} />
        </div>
        <div className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-semibold">Recent Activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">Latest team actions</p>
            </div>
            {canViewActivity && (
              <Link
                href="/admin/activity"
                className="text-xs font-medium text-primary hover:underline"
              >
                View all
              </Link>
            )}
          </div>
          <div className="mt-4">
            <ActivityLogFeed logs={activity} />
          </div>
        </div>
      </div>
    </div>
  );
}
