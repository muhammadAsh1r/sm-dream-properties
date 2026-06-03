"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Testimonial } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteTestimonial,
  toggleTestimonialApproval,
  upsertTestimonial,
} from "@/features/admin/actions/content";
import { testimonialSchema } from "@/features/admin/schemas";

export function TestimonialManager({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    location: "",
    content: "",
    rating: 5,
    photoUrl: "",
    approved: false,
    order: 0,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      role: "",
      location: "",
      content: "",
      rating: 5,
      photoUrl: "",
      approved: false,
      order: testimonials.length,
    });
    setOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name,
      role: t.role,
      location: t.location,
      content: t.content,
      rating: t.rating,
      photoUrl: t.photoUrl ?? "",
      approved: t.approved,
      order: t.order,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const parsed = testimonialSchema.parse(form);
      await upsertTestimonial(editing?.id ?? null, parsed);
      toast.success(editing ? "Testimonial updated" : "Testimonial created");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleApproval = async (id: string) => {
    try {
      await toggleTestimonialApproval(id);
      toast.success("Approval status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    No testimonials yet
                  </TableCell>
                </TableRow>
              ) : (
                testimonials.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="relative size-10 overflow-hidden rounded-full bg-muted">
                        {t.photoUrl && (
                          <Image src={t.photoUrl} alt="" fill className="object-cover" sizes="40px" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="size-3.5 fill-brand-accent text-brand-accent" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{t.location || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={t.approved ? "forSale" : "outline"}>
                        {t.approved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(t.createdAt, "dd MMM yyyy")}
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
                          <DropdownMenuItem onClick={() => openEdit(t)}>
                            <Pencil className="size-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleApproval(t.id)}>
                            Toggle Approval
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(t.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="size-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Photo URL</Label>
              <Input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Rating (1-5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Review</Label>
              <Textarea
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-3">
              <Switch checked={form.approved} onCheckedChange={(v) => setForm({ ...form, approved: v })} />
              <span className="text-sm">Approved</span>
            </label>
            <Button onClick={handleSave} className="w-full bg-primary text-secondary hover:bg-primary/90">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button onClick={openCreate} className="mt-4 bg-primary text-secondary hover:bg-primary/90">
        Add Testimonial
      </Button>
    </>
  );
}
