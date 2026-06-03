"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Property, PropertyImage } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createProperty,
  generatePropertyId,
  updateProperty,
} from "@/features/admin/actions/properties";
import {
  PropertyImageUploader,
  type ImageItem,
} from "@/features/admin/components/properties/property-image-uploader";
import { propertyFormSchema, type PropertyFormValues } from "@/features/admin/schemas";

type PropertyFormProps = {
  property?: Property & { images: PropertyImage[] };
  agents?: { id: string; name: string | null; email: string }[];
};

const selectClass =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

export function PropertyForm({ property, agents = [] }: PropertyFormProps) {
  const router = useRouter();
  const isEdit = Boolean(property);
  const [images, setImages] = useState<ImageItem[]>(
    property?.images.map((img) => ({ url: img.url, alt: img.alt ?? undefined, order: img.order })) ?? []
  );

  const coords = property?.coordinates as { lat?: number; lng?: number } | null;

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema) as Resolver<PropertyFormValues>,
    defaultValues: {
      title: property?.title ?? "",
      slug: property?.slug ?? "",
      propertyId: property?.propertyId ?? "",
      shortDescription: property?.shortDescription ?? "",
      description: property?.description ?? "",
      price: property ? Number(property.price) : 0,
      currency: property?.currency ?? "PKR",
      type: property?.type ?? "SALE",
      kind: property?.kind ?? "HOUSE",
      category: property?.category ?? "RESIDENTIAL",
      location: property?.location ?? "",
      locationArea: property?.locationArea ?? "FAISAL_TOWN",
      area: property?.area ?? 0,
      areaUnit: property?.areaUnit ?? "MARLA",
      bedrooms: property?.bedrooms ?? undefined,
      bathrooms: property?.bathrooms ?? undefined,
      garage: property?.garage ?? undefined,
      purpose: property?.purpose ?? "Residential",
      possessionStatus: property?.possessionStatus ?? "READY",
      amenities: property?.amenities ?? [],
      nearbyLandmarks: property?.nearbyLandmarks ?? [],
      lat: coords?.lat ?? undefined,
      lng: coords?.lng ?? undefined,
      featured: property?.featured ?? false,
      isNew: property?.isNew ?? true,
      published: property?.published ?? false,
      archived: property?.archived ?? false,
      seoTitle: property?.seoTitle ?? "",
      seoDescription: property?.seoDescription ?? "",
      ogImage: property?.ogImage ?? "",
      canonicalUrl: property?.canonicalUrl ?? "",
      schemaDataJson: property?.schemaData
        ? JSON.stringify(property.schemaData, null, 2)
        : "",
      assignedAgentId: property?.assignedAgentId ?? null,
      images: [],
    },
  });

  useEffect(() => {
    if (!isEdit) {
      generatePropertyId().then((id) => form.setValue("propertyId", id));
    }
  }, [isEdit, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload = { ...values, images };
      if (isEdit && property) {
        await updateProperty(property.id, payload);
        toast.success("Property updated");
        router.push("/admin/properties");
        return;
      } else {
        const created = await createProperty(payload);
        toast.success("Property created");
        router.push(`/admin/properties/edit/${created.id}`);
        return;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  });

  const amenitiesText = form.watch("amenities")?.join("\n") ?? "";
  const landmarksText = form.watch("nearbyLandmarks")?.join("\n") ?? "";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold">Basic Information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Property Title</Label>
                <Input {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input {...form.register("slug")} placeholder="10-marla-plot-faisal-town" />
              </div>
              <div className="space-y-2">
                <Label>Property ID</Label>
                <Input {...form.register("propertyId")} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Short Description</Label>
                <Textarea rows={2} {...form.register("shortDescription")} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Full Description</Label>
                <Textarea rows={5} {...form.register("description")} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold">Pricing & Type</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Price (PKR)</Label>
                <Input type="number" {...form.register("price")} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select {...form.register("type")} className={selectClass}>
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Property Type</Label>
                <select {...form.register("kind")} className={selectClass}>
                  <option value="RESIDENTIAL_PLOT">Residential Plot</option>
                  <option value="COMMERCIAL_PLOT">Commercial Plot</option>
                  <option value="HOUSE">House</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="FARMHOUSE">Farmhouse</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select {...form.register("category")} className={selectClass}>
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="PLOT">Plot</option>
                  <option value="INDUSTRIAL">Industrial</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Possession</Label>
                <select {...form.register("possessionStatus")} className={selectClass}>
                  <option value="READY">Ready</option>
                  <option value="UNDER_CONSTRUCTION">Under Construction</option>
                  <option value="BOOKING">Booking Open</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold">Location & Specs</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2 sm:col-span-2">
                <Label>Location</Label>
                <Input {...form.register("location")} />
              </div>
              <div className="space-y-2">
                <Label>Area Zone</Label>
                <select {...form.register("locationArea")} className={selectClass}>
                  <option value="FAISAL_TOWN">Faisal Town</option>
                  <option value="FAISAL_HILLS">Faisal Hills</option>
                  <option value="B17">B17</option>
                  <option value="ISLAMABAD">Islamabad</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Area Size</Label>
                <Input type="number" step="0.01" {...form.register("area")} />
              </div>
              <div className="space-y-2">
                <Label>Area Unit</Label>
                <select {...form.register("areaUnit")} className={selectClass}>
                  <option value="MARLA">Marla</option>
                  <option value="KANAL">Kanal</option>
                  <option value="SQFT">Sq.ft</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Input type="number" {...form.register("bedrooms")} />
              </div>
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <Input type="number" {...form.register("bathrooms")} />
              </div>
              <div className="space-y-2">
                <Label>Garage</Label>
                <Input type="number" {...form.register("garage")} />
              </div>
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input type="number" step="any" {...form.register("lat")} />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input type="number" step="any" {...form.register("lng")} />
              </div>
              {agents.length > 0 && (
                <div className="space-y-2 sm:col-span-2">
                  <Label>Assigned Agent</Label>
                  <select {...form.register("assignedAgentId")} className={selectClass}>
                    <option value="">Unassigned</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.name ?? a.email}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold">Amenities & Landmarks</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Amenities (one per line)</Label>
                <Textarea
                  rows={6}
                  value={amenitiesText}
                  onChange={(e) =>
                    form.setValue(
                      "amenities",
                      e.target.value.split("\n").filter(Boolean)
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Nearby Landmarks (one per line)</Label>
                <Textarea
                  rows={6}
                  value={landmarksText}
                  onChange={(e) =>
                    form.setValue(
                      "nearbyLandmarks",
                      e.target.value.split("\n").filter(Boolean)
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 rounded-xl border border-border/80 bg-background p-6 shadow-sm">
            <label className="flex items-center gap-3">
              <Switch
                checked={form.watch("featured")}
                onCheckedChange={(v) => form.setValue("featured", v)}
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
            <label className="flex items-center gap-3">
              <Switch
                checked={form.watch("published")}
                onCheckedChange={(v) => form.setValue("published", v)}
              />
              <span className="text-sm font-medium">Published</span>
            </label>
            <label className="flex items-center gap-3">
              <Switch
                checked={form.watch("isNew")}
                onCheckedChange={(v) => form.setValue("isNew", v)}
              />
              <span className="text-sm font-medium">New Listing</span>
            </label>
          </div>
        </TabsContent>

        <TabsContent value="images">
          <div className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
            <PropertyImageUploader images={images} onChange={setImages} />
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input {...form.register("seoTitle")} placeholder="Defaults to property title" />
              </div>
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Textarea rows={3} {...form.register("seoDescription")} />
              </div>
              <div className="space-y-2">
                <Label>Open Graph Image URL</Label>
                <Input {...form.register("ogImage")} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input {...form.register("canonicalUrl")} />
              </div>
              <div className="space-y-2">
                <Label>Schema.org JSON-LD</Label>
                <Textarea
                  rows={6}
                  {...form.register("schemaDataJson")}
                  placeholder='{"@context": "https://schema.org", "@type": "RealEstateListing", ...}'
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Optional structured data for search engines. Must be valid JSON.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-primary font-semibold text-secondary hover:bg-primary/90"
        >
          {form.formState.isSubmitting ? "Saving..." : isEdit ? "Update Property" : "Create Property"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/properties")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
