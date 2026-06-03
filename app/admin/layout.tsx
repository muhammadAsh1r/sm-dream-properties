import { AdminShell } from "@/features/admin/components/layout/admin-shell";
import { getClerkAuth } from "@/lib/auth/clerk-session";
import { requireAdminUser, syncUserFromClerk } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await getClerkAuth();
  if (userId) {
    await syncUserFromClerk(userId);
  }
  const user = await requireAdminUser();

  return <AdminShell user={user}>{children}</AdminShell>;
}
