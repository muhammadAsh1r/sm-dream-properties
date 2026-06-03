import { Suspense } from "react";

import { getAdminInquiries } from "@/features/admin/actions/inquiries";
import { InquiryTable } from "@/features/admin/components/inquiries/inquiry-table";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";
import { AdminSearchBar } from "@/features/admin/components/shared/admin-search-bar";
import { getCurrentUser } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string }>;
};

export default async function AdminInquiriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [inquiries, user] = await Promise.all([
    getAdminInquiries(params.q, params.status),
    getCurrentUser(),
  ]);

  const canEdit = hasPermission(user!.role, "inquiries:edit");

  return (
    <div>
      <AdminPageHeader
        title="Inquiries"
        description="Review and respond to property inquiries"
      />

      <div className="mb-6">
        <Suspense>
          <AdminSearchBar
            placeholder="Search inquiries..."
            filters={[
              {
                key: "status",
                label: "All Statuses",
                options: [
                  { label: "New", value: "NEW" },
                  { label: "In Progress", value: "IN_PROGRESS" },
                  { label: "Resolved", value: "RESOLVED" },
                  { label: "Closed", value: "CLOSED" },
                ],
              },
            ]}
          />
        </Suspense>
      </div>

      <InquiryTable inquiries={inquiries} canEdit={canEdit} />
    </div>
  );
}
