import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { getAdminProperties } from "@/features/admin/actions/properties";
import { PropertyTable } from "@/features/admin/components/properties/property-table";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";
import { AdminSearchBar } from "@/features/admin/components/shared/admin-search-bar";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";

type PageProps = {
  searchParams: Promise<{ q?: string; published?: string; featured?: string; archived?: string }>;
};

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [properties, user] = await Promise.all([
    getAdminProperties(params.q, {
      published: params.published,
      featured: params.featured,
      archived: params.archived,
    }),
    getCurrentUser(),
  ]);

  const permissions = {
    canDelete: hasPermission(user!.role, "properties:delete"),
    canFeature: hasPermission(user!.role, "properties:feature"),
    canCreate: hasPermission(user!.role, "properties:create"),
  };

  return (
    <div>
      <AdminPageHeader
        title="Properties"
        description="Manage listings, images, and SEO"
        actions={
          <Button
            render={<Link href="/admin/properties/new" />}
            className="bg-primary font-semibold text-secondary hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Add Property
          </Button>
        }
      />

      <div className="mb-6">
        <Suspense>
          <AdminSearchBar
            placeholder="Search properties..."
            filters={[
              {
                key: "published",
                label: "All Status",
                options: [
                  { label: "Published", value: "true" },
                  { label: "Draft", value: "false" },
                ],
              },
              {
                key: "featured",
                label: "Featured",
                options: [{ label: "Featured Only", value: "true" }],
              },
              {
                key: "archived",
                label: "Archived",
                options: [{ label: "Show Archived", value: "true" }],
              },
            ]}
          />
        </Suspense>
      </div>

      <PropertyTable properties={properties} permissions={permissions} />
    </div>
  );
}
