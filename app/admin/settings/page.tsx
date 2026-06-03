import { getSettings } from "@/features/admin/actions/users-settings";
import { SettingsForm } from "@/features/admin/components/settings/settings-form";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Company information, contact details, and social links"
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
