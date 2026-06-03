import { Suspense } from "react";

import { getAdminLeads } from "@/features/admin/actions/leads";
import { getAgents } from "@/features/admin/actions/users-settings";
import { CreateLeadDialog } from "@/features/admin/components/leads/create-lead-dialog";
import { LeadTable } from "@/features/admin/components/leads/lead-table";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";
import { AdminSearchBar } from "@/features/admin/components/shared/admin-search-bar";
import { getCurrentUser } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string }>;
};

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [leads, agents, user] = await Promise.all([
    getAdminLeads(params.q, params.status),
    getAgents(),
    getCurrentUser(),
  ]);

  const canEdit = hasPermission(user!.role, "leads:edit");

  return (
    <div>
      <AdminPageHeader
        title="Leads"
        description="Track and manage sales leads"
        actions={canEdit ? <CreateLeadDialog agents={agents} /> : undefined}
      />

      <div className="mb-6">
        <Suspense>
          <AdminSearchBar
            placeholder="Search leads..."
            filters={[
              {
                key: "status",
                label: "All Statuses",
                options: [
                  { label: "New", value: "NEW" },
                  { label: "Contacted", value: "CONTACTED" },
                  { label: "Qualified", value: "QUALIFIED" },
                  { label: "Negotiating", value: "NEGOTIATING" },
                  { label: "Closed", value: "CLOSED" },
                  { label: "Lost", value: "LOST" },
                ],
              },
            ]}
          />
        </Suspense>
      </div>

      <LeadTable leads={leads} agents={agents} canEdit={canEdit} />
    </div>
  );
}
