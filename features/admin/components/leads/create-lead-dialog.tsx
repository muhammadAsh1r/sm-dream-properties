"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLead } from "@/features/admin/actions/leads";

type CreateLeadDialogProps = {
  agents?: { id: string; name: string | null; email: string }[];
};

export function CreateLeadDialog({ agents = [] }: CreateLeadDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      await createLead({
        name: String(form.get("name")),
        phone: String(form.get("phone")),
        email: String(form.get("email") || "") || undefined,
        source: String(form.get("source") || "manual"),
        assignedAgentId: String(form.get("assignedAgentId") || "") || undefined,
      });
      toast.success("Lead created");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-primary font-semibold text-secondary hover:bg-primary/90">
            <Plus className="size-4" />
            Add Lead
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Name</Label>
            <Input id="lead-name" name="name" required minLength={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-phone">Phone</Label>
            <Input id="lead-phone" name="phone" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-email">Email</Label>
            <Input id="lead-email" name="email" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-source">Source</Label>
            <Input id="lead-source" name="source" defaultValue="manual" />
          </div>
          {agents.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="lead-agent">Assign Agent</Label>
              <select
                id="lead-agent"
                name="assignedAgentId"
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
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Lead"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
