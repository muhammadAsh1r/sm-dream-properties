"use client";

import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Settings } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSettings } from "@/features/admin/actions/users-settings";
import { settingsSchema, type SettingsFormValues } from "@/features/admin/schemas";

type SettingsFormProps = {
  settings: Settings;
};

function parseAddress(address: Settings["address"]) {
  if (!address || typeof address !== "object") {
    return { line1: "", line2: "", line3: "" };
  }
  const a = address as { line1?: string; line2?: string; line3?: string };
  return { line1: a.line1 ?? "", line2: a.line2 ?? "", line3: a.line3 ?? "" };
}

function parseSocial(links: Settings["socialLinks"]) {
  if (!links || typeof links !== "object") {
    return { facebook: "", instagram: "", linkedin: "" };
  }
  const s = links as { facebook?: string; instagram?: string; linkedin?: string };
  return {
    facebook: s.facebook ?? "",
    instagram: s.instagram ?? "",
    linkedin: s.linkedin ?? "",
  };
}

function parseCoords(coords: Settings["mapCoordinates"]) {
  if (!coords || typeof coords !== "object") return { lat: undefined, lng: undefined };
  const c = coords as { lat?: number; lng?: number };
  return { lat: c.lat, lng: c.lng };
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const address = parseAddress(settings.address);
  const social = parseSocial(settings.socialLinks);
  const coords = parseCoords(settings.mapCoordinates);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema) as Resolver<SettingsFormValues>,
    defaultValues: {
      companyName: settings.companyName,
      tagline: settings.tagline,
      phone: settings.phone,
      email: settings.email,
      whatsapp: settings.whatsapp,
      addressLine1: address.line1,
      addressLine2: address.line2,
      addressLine3: address.line3,
      facebook: social.facebook,
      instagram: social.instagram,
      linkedin: social.linkedin,
      mapLat: coords.lat,
      mapLng: coords.lng,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateSettings(values);
      toast.success("Settings saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  });

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-8">
      <section className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold">Company Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Company Name</Label>
            <Input {...form.register("companyName")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Tagline</Label>
            <Input {...form.register("tagline")} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold">Contact</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input {...form.register("phone")} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...form.register("email")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>WhatsApp Number</Label>
            <Input {...form.register("whatsapp")} placeholder="+92..." />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold">Office Address</h2>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Address Line 1</Label>
            <Input {...form.register("addressLine1")} />
          </div>
          <div className="space-y-2">
            <Label>Address Line 2</Label>
            <Input {...form.register("addressLine2")} />
          </div>
          <div className="space-y-2">
            <Label>Address Line 3</Label>
            <Input {...form.register("addressLine3")} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold">Social Media</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input {...form.register("facebook")} placeholder="https://facebook.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input {...form.register("instagram")} placeholder="https://instagram.com/..." />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>LinkedIn</Label>
            <Input {...form.register("linkedin")} placeholder="https://linkedin.com/..." />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold">Google Maps</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Latitude</Label>
            <Input type="number" step="any" {...form.register("mapLat")} />
          </div>
          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input type="number" step="any" {...form.register("mapLng")} />
          </div>
        </div>
      </section>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="bg-primary font-semibold text-secondary hover:bg-primary/90"
      >
        {form.formState.isSubmitting ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
