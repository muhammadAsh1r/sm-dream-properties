"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Lead, Property, User } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateLeadStatus } from "@/features/admin/actions/leads";
import { LeadDetailSheet } from "@/features/admin/components/leads/lead-detail-sheet";

type LeadRow = Lead & {
  property: Pick<Property, "title" | "slug"> | null;
  assignedAgent: Pick<User, "name"> | null;
};

const STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "NEGOTIATING",
  "CLOSED",
  "LOST",
] as const;

const STATUS_VARIANT: Record<string, "default" | "forSale" | "outline" | "secondary"> = {
  NEW: "forSale",
  CONTACTED: "secondary",
  QUALIFIED: "default",
  NEGOTIATING: "outline",
  CLOSED: "default",
  LOST: "secondary",
};

type LeadTableProps = {
  leads: LeadRow[];
  agents?: { id: string; name: string | null; email: string }[];
  canEdit: boolean;
};

export function LeadTable({ leads, agents = [], canEdit }: LeadTableProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<LeadRow | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateLeadStatus(id, status);
      toast.success("Lead status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
        No leads found
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(lead)}
                >
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.email ?? "—"}
                  </TableCell>
                  <TableCell>
                    {lead.property ? (
                      <Link
                        href={`/properties/${lead.property.slug}`}
                        className="text-sm text-primary hover:underline"
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lead.property.title}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {lead.assignedAgent?.name ?? "—"}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {lead.source}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(lead.createdAt, "dd MMM yyyy")}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Badge variant={STATUS_VARIANT[lead.status] ?? "outline"}>
                        {lead.status.replace("_", " ")}
                      </Badge>
                      {canEdit && (
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                          aria-label={`Update status for ${lead.name}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <LeadDetailSheet
        lead={selected}
        agents={agents}
        canEdit={canEdit}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
