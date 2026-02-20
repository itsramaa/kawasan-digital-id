import { z } from "zod";

export const inquirySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().trim().max(2000, "Description too long").optional().or(z.literal("")),
  budget_estimate: z.string().optional().or(z.literal("")),
  client_id: z.string().optional().or(z.literal("")),
});

export const ticketSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject too long"),
  description: z.string().trim().max(2000, "Description too long").optional().or(z.literal("")),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
});

export const clientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  company_name: z.string().trim().max(100, "Company name too long").optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(20, "Phone too long").optional().or(z.literal("")),
  industry: z.string().trim().max(50).optional().or(z.literal("")),
  tax_id: z.string().trim().max(30).optional().or(z.literal("")),
});

export const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  phone: z.string().trim().max(20, "Phone too long").optional().or(z.literal("")),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
export type TicketFormValues = z.infer<typeof ticketSchema>;
export type ClientFormValues = z.infer<typeof clientSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
