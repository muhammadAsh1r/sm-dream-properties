import { AdminShell } from "@/features/admin/components/layout/admin-shell";
import { requireAdminUser, syncUserFromClerk } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await syncUserFromClerk();
  const user = await requireAdminUser();

  return <AdminShell user={user}>{children}</AdminShell>;
}
