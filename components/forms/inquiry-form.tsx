"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitInquiryForm } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  inquiryFormSchema,
  type InquiryFormValues,
} from "@/types/forms";

type InquiryFormProps = {
  className?: string;
  propertyId?: string;
  propertyTitle?: string;
  onSubmit?: (values: InquiryFormValues) => Promise<void> | void;
};

export function InquiryForm({
  className,
  propertyId,
  propertyTitle,
  onSubmit,
}: InquiryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      propertyId,
      propertyTitle,
      inquiryType: "buy",
      message: "",
    },
  });

  const handleFormSubmit = handleSubmit(async (values) => {
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        await submitInquiryForm(values);
        toast.success("Inquiry sent successfully");
      }
      reset();
    } catch {
      toast.error("Failed to send inquiry");
    }
  });

  return (
    <form
      onSubmit={handleFormSubmit}
      className={cn("space-y-5", className)}
      noValidate
      aria-label="Property inquiry form"
    >
      {propertyTitle && (
        <p className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          Inquiring about:{" "}
          <span className="font-medium text-foreground">{propertyTitle}</span>
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inquiry-name">Full Name</Label>
          <Input
            id="inquiry-name"
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="inquiry-email">Email Address</Label>
          <Input
            id="inquiry-email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inquiry-phone">Phone Number</Label>
          <Input
            id="inquiry-phone"
            type="tel"
            placeholder="+92 300 0000000"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-destructive" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="inquiry-type">Inquiry Type</Label>
          <select
            id="inquiry-type"
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-invalid={Boolean(errors.inquiryType)}
            {...register("inquiryType")}
          >
            <option value="buy">Buy Property</option>
            <option value="rent">Rent Property</option>
            <option value="sell">Sell Property</option>
            <option value="general">General Inquiry</option>
          </select>
          {errors.inquiryType && (
            <p className="text-sm text-destructive" role="alert">
              {errors.inquiryType.message}
            </p>
          )}
        </div>
      </div>

      <input type="hidden" {...register("propertyId")} />
      <input type="hidden" {...register("propertyTitle")} />

      <div className="space-y-2">
        <Label htmlFor="inquiry-message">Message</Label>
        <Textarea
          id="inquiry-message"
          rows={5}
          placeholder="Share your requirements, budget, or preferred timeline..."
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-destructive" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="xl"
        disabled={isSubmitting}
        className="w-full bg-primary font-semibold text-secondary hover:bg-primary/90 sm:w-auto"
      >
        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}
