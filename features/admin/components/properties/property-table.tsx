"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
  Archive,
} from "lucide-react";
import { toast } from "sonner";
import type { Property, PropertyImage } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  archiveProperty,
  deleteProperty,
  duplicateProperty,
  togglePropertyFeatured,
} from "@/features/admin/actions/properties";

type PropertyRow = Property & {
  images: PropertyImage[];
  assignedAgent: { name: string | null } | null;
};

function formatPrice(price: number | { toString(): string }, currency: string) {
  const num = typeof price === "number" ? price : Number(price.toString());
  if (num >= 10_000_000) return `${currency} ${(num / 10_000_000).toFixed(2)} Cr`;
  if (num >= 100_000) return `${currency} ${(num / 100_000).toFixed(1)} L`;
  return `${currency} ${num.toLocaleString()}`;
}

type PropertyTableProps = {
  properties: PropertyRow[];
  permissions?: {
    canDelete?: boolean;
    canFeature?: boolean;
    canCreate?: boolean;
  };
};

export function PropertyTable({
  properties,
  permissions = { canDelete: true, canFeature: true, canCreate: true },
}: PropertyTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteProperty(id);
      toast.success("Property deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete property");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await duplicateProperty(id);
      toast.success("Property duplicated");
      router.push(`/admin/properties/edit/${copy.id}`);
    } catch {
      toast.error("Failed to duplicate");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await togglePropertyFeatured(id);
      toast.success("Featured status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveProperty(id);
      toast.success("Property archived");
      router.refresh();
    } catch {
      toast.error("Failed to archive");
    }
  };

  if (properties.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
        No properties found. Create your first listing.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => {
              const thumb = property.images[0]?.url;
              return (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="relative size-12 overflow-hidden rounded-lg bg-muted">
                      {thumb && (
                        <Image src={thumb} alt="" fill className="object-cover" sizes="48px" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{property.title}</p>
                      <p className="text-xs text-muted-foreground">{property.propertyId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {property.location}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(property.price, property.currency)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={property.published ? "forSale" : "outline"}>
                        {property.published ? "Published" : "Draft"}
                      </Badge>
                      {property.archived && <Badge variant="secondary">Archived</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {property.featured ? (
                      <Star className="size-4 fill-brand-accent text-brand-accent" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(property.createdAt, "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          render={<Link href={`/admin/properties/edit/${property.id}`} />}
                        >
                          <Pencil className="size-4" /> Edit
                        </DropdownMenuItem>
                        {property.published && (
                          <DropdownMenuItem
                            render={
                              <Link href={`/properties/${property.slug}`} target="_blank" />
                            }
                          >
                            <ExternalLink className="size-4" /> View
                          </DropdownMenuItem>
                        )}
                        {permissions.canFeature && (
                          <DropdownMenuItem onClick={() => handleToggleFeatured(property.id)}>
                            <Star className="size-4" /> Toggle Featured
                          </DropdownMenuItem>
                        )}
                        {permissions.canCreate && (
                          <DropdownMenuItem onClick={() => handleDuplicate(property.id)}>
                            <Copy className="size-4" /> Duplicate
                          </DropdownMenuItem>
                        )}
                        {permissions.canDelete && (
                          <>
                            <DropdownMenuItem onClick={() => handleArchive(property.id)}>
                              <Archive className="size-4" /> Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(property.id, property.title)}
                              className="text-destructive"
                            >
                              <Trash2 className="size-4" /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
