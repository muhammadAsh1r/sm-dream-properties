import { Suspense } from "react";

import { getAdminUsers } from "@/features/admin/actions/users-settings";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";
import { AdminSearchBar } from "@/features/admin/components/shared/admin-search-bar";
import { InviteAgentDialog } from "@/features/admin/components/users/invite-agent-dialog";
import { UserTable } from "@/features/admin/components/users/user-table";
import { getCurrentUser } from "@/lib/auth";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [users, actor] = await Promise.all([getAdminUsers(params.q), getCurrentUser()]);

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Manage team members, roles, and access"
        actions={<InviteAgentDialog />}
      />

      <div className="mb-6 rounded-xl border border-border/80 bg-muted/30 p-4 text-sm text-muted-foreground">
        Invite agents via email or assign roles directly. Super Admin access is set in Clerk
        public metadata as{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">SUPER_ADMIN</code>.
      </div>

      <div className="mb-6">
        <Suspense>
          <AdminSearchBar placeholder="Search users..." />
        </Suspense>
      </div>

      <UserTable users={users} actorRole={actor!.role} actorId={actor!.id} />
    </div>
  );
}
