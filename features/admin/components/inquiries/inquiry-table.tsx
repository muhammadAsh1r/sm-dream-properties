"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Inquiry, Property } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateInquiryStatus } from "@/features/admin/actions/inquiries";

type InquiryRow = Inquiry & {
  property: Pick<Property, "title" | "slug" | "propertyId"> | null;
};

const STATUSES = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

export function InquiryTable({
  inquiries,
  canEdit,
}: {
  inquiries: InquiryRow[];
  canEdit: boolean;
}) {
  const router = useRouter();

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateInquiryStatus(id, status);
      toast.success("Inquiry status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (inquiries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
        No inquiries yet
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell className="font-medium">{inquiry.name}</TableCell>
                <TableCell>{inquiry.phone}</TableCell>
                <TableCell className="text-muted-foreground">{inquiry.email}</TableCell>
                <TableCell>
                  {inquiry.property ? (
                    <Link
                      href={`/properties/${inquiry.property.slug}`}
                      className="text-sm text-primary hover:underline"
                      target="_blank"
                    >
                      {inquiry.property.title}
                    </Link>
                  ) : (
                    "General"
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {inquiry.inquiryType.toLowerCase().replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                  {inquiry.message}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(inquiry.createdAt, "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  {canEdit ? (
                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                      aria-label={`Update status for ${inquiry.name}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge variant="secondary">
                      {inquiry.status.replace("_", " ")}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
