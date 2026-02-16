import { z } from "zod";

export const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount_cents: z.number().int().min(0),
});

export const investmentSchema = z.object({
  line_items: z.array(lineItemSchema),
  total_cents: z.number().int().min(0),
  currency: z.string().default("usd"),
});

export const scopeItemSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
});

export const deliverableSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
});

export const timelinePhaseSchema = z.object({
  phase: z.string().min(1),
  duration: z.string().min(1),
  description: z.string(),
});

export const customSectionSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export const createProposalSchema = z.object({
  client_brief: z.string().min(10, "Brief must be at least 10 characters"),
  client_name: z.string().optional(),
  client_email: z.string().email().optional().or(z.literal("")),
  client_company: z.string().optional(),
  service_type: z.string().optional(),
  template_id: z.string().optional().or(z.literal("")),
});

export const updateProposalSchema = z.object({
  title: z.string().min(1).optional(),
  status: z
    .enum(["draft", "review", "sent", "accepted", "declined", "expired"])
    .optional(),
  executive_summary: z.string().optional(),
  understanding: z.string().optional(),
  scope_of_work: z.array(scopeItemSchema).optional(),
  deliverables: z.array(deliverableSchema).optional(),
  timeline: z.array(timelinePhaseSchema).optional(),
  investment: investmentSchema.optional(),
  terms: z.string().optional(),
  about_us: z.string().optional(),
  custom_sections: z.array(customSectionSchema).optional(),
  valid_until: z.string().optional(),
  share_enabled: z.boolean().optional(),
  client_name: z.string().optional(),
  client_email: z.string().optional(),
  client_company: z.string().optional(),
  layout: z.enum(["modern", "classic", "bold", "minimal"]).optional(),
  template_color_primary: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().or(z.literal("")).or(z.null()),
  template_color_accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().or(z.literal("")).or(z.null()),
});

export type CreateProposalInput = z.infer<typeof createProposalSchema>;
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>;
