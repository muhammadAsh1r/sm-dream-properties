import Link from "next/link";
import { Suspense } from "react";

import { getActivityEntityTypes, getActivityLogs } from "@/features/admin/actions/activity";
import { ActivityLogTable } from "@/features/admin/components/shared/activity-log-table";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";
import { AdminSearchBar } from "@/features/admin/components/shared/admin-search-bar";

type PageProps = {
  searchParams: Promise<{ q?: string; entityType?: string; page?: string }>;
};

export default async function AdminActivityPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const [result, entityTypes] = await Promise.all([
    getActivityLogs(page, { q: params.q, entityType: params.entityType }),
    getActivityEntityTypes(),
  ]);

  const totalPages = Math.ceil(result.total / result.pageSize);

  return (
    <div>
      <AdminPageHeader
        title="Activity Log"
        description="Audit trail of team actions across the platform"
        backHref="/admin"
        backLabel="Back to Dashboard"
      />

      <div className="mb-6">
        <Suspense>
          <AdminSearchBar
            placeholder="Search actions..."
            filters={[
              {
                key: "entityType",
                label: "All Entities",
                options: entityTypes.map((t) => ({ label: t, value: t })),
              },
            ]}
          />
        </Suspense>
      </div>

      <ActivityLogTable logs={result.logs} />

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Page {page} of {totalPages} · {result.total} entries
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/activity?page=${page - 1}${params.q ? `&q=${params.q}` : ""}${params.entityType ? `&entityType=${params.entityType}` : ""}`}
                className="rounded-lg border border-border px-3 py-1.5 hover:bg-muted"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/activity?page=${page + 1}${params.q ? `&q=${params.q}` : ""}${params.entityType ? `&entityType=${params.entityType}` : ""}`}
                className="rounded-lg border border-border px-3 py-1.5 hover:bg-muted"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
