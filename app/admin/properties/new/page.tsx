import { getAgents } from "@/features/admin/actions/users-settings";
import { PropertyForm } from "@/features/admin/components/properties/property-form";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";
import { requirePermission } from "@/lib/auth";

export default async function NewPropertyPage() {
  await requirePermission("properties:create");
  const agents = await getAgents();

  return (
    <div>
      <AdminPageHeader
        title="New Property"
        description="Create a new property listing"
        backHref="/admin/properties"
        backLabel="Back to Properties"
      />
      <PropertyForm agents={agents} />
    </div>
  );
}
