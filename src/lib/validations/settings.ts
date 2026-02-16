import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const brandSchema = z.object({
  brand_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  brand_accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type BrandInput = z.infer<typeof brandSchema>;
