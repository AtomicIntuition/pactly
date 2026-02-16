"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateProfile, getProfile } from "@/lib/supabase/queries";
import { profileSchema, brandSchema, logoUploadSchema } from "@/lib/validations/settings";

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

export async function uploadLogoAction(formData: FormData): Promise<ActionResult & { logoUrl?: string }> {
  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided" };

  const validated = logoUploadSchema.safeParse({
    fileType: file.type,
    fileSize: file.size,
  });
  if (!validated.success) return { error: validated.error.issues[0].message };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const path = `${user.id}/logo.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("logos")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);

  const logoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

  await updateProfile(supabase, user.id, { company_logo_url: logoUrl });

  revalidatePath("/settings/brand");
  return { success: true, logoUrl };
}

export async function deleteLogoAction(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const profile = await getProfile(supabase, user.id);
  if (!profile?.company_logo_url) return { error: "No logo to delete" };

  // Extract storage path from URL
  const url = new URL(profile.company_logo_url.split("?")[0]);
  const pathParts = url.pathname.split("/storage/v1/object/public/logos/");
  if (pathParts[1]) {
    await supabase.storage.from("logos").remove([decodeURIComponent(pathParts[1])]);
  }

  await updateProfile(supabase, user.id, { company_logo_url: null });

  revalidatePath("/settings/brand");
  return { success: true };
}
