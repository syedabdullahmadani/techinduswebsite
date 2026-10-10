import { z } from "zod";
const text = (max: number) => z.string().trim().min(1, "This field is required.").max(max);
export const jobSchema = z.object({
  id: z.string().uuid().optional(),
  title: text(160),
  slug: text(160).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens."),
  department: text(100),
  employment_type: text(100),
  work_location: text(160),
  shift: text(100),
  experience: text(100),
  openings: text(50),
  description: z.string().trim().min(10).max(8000),
  application_email: z.string().trim().email().max(254),
  status: z.enum(["draft", "published", "archived"]),
  date_posted: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  eligibility_country: z.string().trim().max(100).nullable().optional(),
});
export type JobInput = z.infer<typeof jobSchema>;
export const jobStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["draft", "published", "archived"]),
});
export const contactSchema = z.object({
  name: text(100),
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  message: text(3000),
  website: z.string().max(0, "Unable to submit this enquiry.").default(""),
});
export const applicationSchema = z.object({
  job_id: z.string().uuid(),
  name: text(100),
  email: z.string().trim().email().max(254),
  phone: text(30).regex(/^\+?[\d\s()-]{7,30}$/, "Enter a valid phone number."),
  experience: text(200),
  message: z.string().trim().max(3000).default(""),
  resume_url: z
    .union([
      z.literal(""),
      z
        .string()
        .url()
        .max(1000)
        .refine((value) => value.startsWith("https://"), "Use an HTTPS link."),
    ])
    .default(""),
  website: z.string().max(0).default(""),
});
export const settingsSchema = z.object({
  contact_email: z.string().trim().email().max(254),
  contact_phone: text(30).regex(/^\+?[\d\s()-]+$/, "Enter a valid phone number."),
  whatsapp_number: z.string().regex(/^\d{8,15}$/, "Use 8–15 digits, including the country code."),
  footer_description: text(500),
});
