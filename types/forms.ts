import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const inquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
  inquiryType: z.enum(["buy", "rent", "sell", "general"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;
