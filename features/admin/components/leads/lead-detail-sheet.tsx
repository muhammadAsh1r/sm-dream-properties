"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Lead, Property, User } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { updateLead } from "@/features/admin/actions/leads";

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

type LeadDetailSheetProps = {
  lead: LeadRow | null;
  agents?: { id: string; name: string | null; email: string }[];
  canEdit: boolean;
  onClose: () => void;
};

export function LeadDetailSheet({
  lead,
  agents = [],
  canEdit,
  onClose,
}: LeadDetailSheetProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(lead?.notes ?? "");
  const [agentId, setAgentId] = useState(lead?.assignedAgentId ?? "");
  const [status, setStatus] = useState(lead?.status ?? "NEW");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes ?? "");
      setAgentId(lead.assignedAgentId ?? "");
      setStatus(lead.status);
    }
  }, [lead]);

  if (!lead) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateLead(lead.id, {
        notes,
        assignedAgentId: agentId || null,
        status,
      });
      toast.success("Lead updated");
      router.refresh();
      onClose();
    } catch {
      toast.error("Failed to update lead");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={Boolean(lead)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{lead.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="grid gap-2 text-sm">
            <p>
              <span className="text-muted-foreground">Phone:</span> {lead.phone}
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              {lead.email ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Source:</span> {lead.source}
            </p>
            {lead.property && (
              <p>
                <span className="text-muted-foreground">Property:</span>{" "}
                {lead.property.title}
              </p>
            )}
          </div>

          {canEdit ? (
            <>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as typeof status)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {agents.length > 0 && (
                <div className="space-y-2">
                  <Label>Assigned Agent</Label>
                  <select
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name ?? a.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes about this lead..."
                />
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Status</Label>
                <p className="text-sm">{lead.status.replace("_", " ")}</p>
              </div>
              {lead.notes && (
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <p className="text-sm text-muted-foreground">{lead.notes}</p>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
