"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createClient as createDbClient,
  updateClient,
  deleteClient,
  logActivity,
} from "@/lib/supabase/queries";
import { createClientSchema, updateClientSchema } from "@/lib/validations/client";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function createClientAction(data: Record<string, unknown>): Promise<ActionResult> {
  const parsed = createClientSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  await createDbClient(supabase, {
    user_id: user.id,
    name: parsed.data.name,
    email: parsed.data.email ?? null,
    company: parsed.data.company ?? null,
    website: parsed.data.website ?? null,
    industry: parsed.data.industry ?? null,
    phone: parsed.data.phone ?? null,
    notes: parsed.data.notes ?? null,
  });

  await logActivity(supabase, {
    user_id: user.id,
    proposal_id: null,
    action: `Added client "${parsed.data.name}"`,
    metadata: {},
  });

  revalidatePath("/clients");
  return { success: true };
}

export async function updateClientAction(
  clientId: string,
  data: Record<string, unknown>
): Promise<ActionResult> {
  const parsed = updateClientSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  await updateClient(supabase, clientId, parsed.data);
  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
  return { success: true };
}

export async function deleteClientAction(clientId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  await deleteClient(supabase, clientId);
  revalidatePath("/clients");
  return { success: true };
}
