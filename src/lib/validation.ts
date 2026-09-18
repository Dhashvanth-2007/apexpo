import * as z from "zod";

export const leadSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Full Name must be at least 2 characters").max(100, "Name is too long"),
  businessName: z.string().trim().max(120, "Business name is too long").optional().default("Direct Inquiry"),
  email: z.string().trim().email("Please provide a valid work email address").max(150),
  phone: z.string().trim().min(7, "Please provide a valid telephone number").max(30),
  service: z.string().trim().min(1, "Please select what you want to build"),
  budget: z.string().trim().min(1, "Please select an estimated project budget"),
  message: z.string().trim().min(10, "Please provide brief project goals (min 10 characters)").max(3000, "Message is too long"),
  honeypot: z.string().optional(), // Anti-spam field: must be empty
});

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Please enter your username").optional(),
  email: z.string().trim().optional(),
  password: z.string().min(1, "Password is required"),
}).refine((data) => !!(data.username || data.email), {
  message: "Username is required",
  path: ["username"],
});

export type LoginInput = z.infer<typeof loginSchema>;

export const credentialsUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required to authorize changes"),
  newUsername: z.string().trim().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores").optional().or(z.literal("")),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional().or(z.literal("")),
});

export type CredentialsUpdateInput = z.infer<typeof credentialsUpdateSchema>;

export const leadStatusUpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "MEETING_SCHEDULED", "PROPOSAL_SENT", "WON", "LOST"]).optional(),
  notes: z.string().max(2000).optional(),
  assignedToId: z.string().nullable().optional(),
});

export const projectSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  category: z.string().trim().min(2),
  description: z.string().trim().min(10),
  clientOrConcept: z.string().default("Concept Project"),
  services: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  heroImage: z.string().min(1),
  gallery: z.array(z.string()).default([]),
  results: z.string().optional().nullable(),
  published: z.boolean().default(true),
  order: z.number().default(0),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  description: z.string().trim().min(10),
  icon: z.string().default("Sparkles"),
  features: z.array(z.string()).default([]),
  startingPrice: z.string().min(1),
  published: z.boolean().default(true),
  order: z.number().default(0),
});

export const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  companyName: z.string().trim().min(2, "Business / Company name is required").max(120),
  email: z.string().trim().email("Please provide a valid work email address").max(150),
  phone: z.string().trim().min(7, "Please provide a valid phone number").max(30),
  callScope: z.string().default("DISCOVERY"),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  timezone: z.string().default("Asia/Kolkata"),
  projectDescription: z.string().trim().max(500).optional().default(""),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
