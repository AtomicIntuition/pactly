import { z } from "zod";

const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color");

export const templateColorSchemeSchema = z.object({
  primary: hexColorSchema,
  accent: hexColorSchema,
});

export const templateAIGuidanceSchema = z.object({
  tone: z.string().min(1),
  industry_context: z.string().min(1),
  pricing_guidance: z.string().min(1),
  pricing_model: z.enum(["fixed", "hourly", "retainer", "milestone", "tiered"]),
  style_notes: z.string().min(1),
});

export const templateContentSchema = z.object({
  color_scheme: templateColorSchemeSchema,
  terms: z.string(),
  ai_guidance: templateAIGuidanceSchema,
  section_config: z.object({
    include_understanding: z.boolean(),
    include_about_us: z.boolean(),
  }),
});
