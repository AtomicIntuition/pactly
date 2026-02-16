"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/supabase/queries";
import { profileSchema, brandSchema } from "@/lib/validations/settings";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function updateProfileAction(data: Record<string, unknown>): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  await updateProfile(supabase, user.id, {
    full_name: parsed.data.full_name,
    company_name: parsed.data.company_name ?? null,
    phone: parsed.data.phone ?? null,
    address: parsed.data.address ?? null,
    bio: parsed.data.bio ?? null,
    website: parsed.data.website ?? null,
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function updateBrandAction(data: Record<string, unknown>): Promise<ActionResult> {
  const parsed = brandSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  await updateProfile(supabase, user.id, {
    brand_color: parsed.data.brand_color,
    brand_accent: parsed.data.brand_accent,
  });

  revalidatePath("/settings/brand");
  return { success: true };
}
