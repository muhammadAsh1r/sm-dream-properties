"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { submitPropertyInquiry } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPropertyWhatsAppMessage } from "@/features/properties/lib/property-utils";
import { getPhoneHref, getWhatsAppUrl } from "@/lib/constants";
import type { Property } from "@/types/property";

const propertyInquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type PropertyInquiryValues = z.infer<typeof propertyInquirySchema>;

type PropertyInquiryCardProps = {
  property: Property;
};

export function PropertyInquiryCard({ property }: PropertyInquiryCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<PropertyInquiryValues>({
    resolver: zodResolver(propertyInquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: `I am interested in ${property.title} (${property.propertyId}). Please contact me with more details.`,
    },
  });

  const whatsappMessage = getPropertyWhatsAppMessage(property);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await submitPropertyInquiry({
        ...data,
        propertyId: property.id,
      });
      if (!result.success) {
        toast.error(result.error ?? "Failed to send inquiry");
        return;
      }
      toast.success("Inquiry sent successfully");
      reset();
    } catch {
      toast.error("Failed to send inquiry");
    }
  });

  return (
    <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-card lg:sticky lg:top-24">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Request Information
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Get expert guidance on this property
      </p>

      {isSubmitSuccessful ? (
        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
          <p className="font-semibold text-foreground">Inquiry Sent!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Our advisor will contact you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="inquiry-name">Name</Label>
            <Input id="inquiry-name" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name && (
              <p className="text-xs text-destructive" role="alert">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="inquiry-phone">Phone</Label>
            <Input id="inquiry-phone" type="tel" {...register("phone")} aria-invalid={!!errors.phone} />
            {errors.phone && (
              <p className="text-xs text-destructive" role="alert">{errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="inquiry-email">Email</Label>
            <Input id="inquiry-email" type="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && (
              <p className="text-xs text-destructive" role="alert">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="inquiry-message">Message</Label>
            <Textarea id="inquiry-message" rows={4} {...register("message")} aria-invalid={!!errors.message} />
            {errors.message && (
              <p className="text-xs text-destructive" role="alert">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full bg-primary font-semibold text-secondary hover:bg-primary/90"
          >
            <Send className="size-4" aria-hidden="true" />
            {isSubmitting ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          render={
            <a
              href={getWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
          className="h-11 bg-[#25D366] font-semibold text-white hover:bg-[#20bd5a]"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          WhatsApp
        </Button>
        <Button
          render={<a href={getPhoneHref()} />}
          variant="outline"
          className="h-11 border-foreground/15 font-semibold"
        >
          <Phone className="size-4" aria-hidden="true" />
          Call Now
        </Button>
      </div>
    </div>
  );
}
