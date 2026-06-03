import { notFound } from "next/navigation";

import { getAdminProperty } from "@/features/admin/actions/properties";
import { getAgents } from "@/features/admin/actions/users-settings";
import { PropertyForm } from "@/features/admin/components/properties/property-form";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const [property, agents] = await Promise.all([
    getAdminProperty(id),
    getAgents(),
  ]);

  if (!property) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Edit Property"
        description={property.title}
        backHref="/admin/properties"
        backLabel="Back to Properties"
      />
      <PropertyForm property={property} agents={agents} />
    </div>
  );
}
