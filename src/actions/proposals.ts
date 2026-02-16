"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createProposal,
  updateProposal,
  getProposal,
  getProfile,
  logActivity,
  findClientByEmailOrCompany,
  createClient as createClientRecord,
  deleteProposal,
} from "@/lib/supabase/queries";
import { createProposalSchema, updateProposalSchema } from "@/lib/validations/proposal";
import { generateProposal } from "@/lib/ai/proposal-generator";
import { PLANS, PROPOSAL_VALIDITY_DAYS } from "@/lib/constants";
import { isSystemTemplateId, getSystemTemplate } from "@/lib/templates";
import type { TemplateContent } from "@/lib/templates/types";
import { addDays } from "date-fns";
import crypto from "crypto";
import { z } from "zod";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

const validStatuses = ["draft", "review", "sent", "accepted", "declined", "expired"] as const;
const statusSchema = z.enum(validStatuses);

export async function createProposalAction(_prevState: ActionResult | void, formData: FormData): Promise<ActionResult | void> {
  const raw = {
    client_brief: formData.get("client_brief"),
    client_name: formData.get("client_name") || undefined,
    client_email: formData.get("client_email") || undefined,
    client_company: formData.get("client_company") || undefined,
    service_type: formData.get("service_type") || undefined,
    template_id: formData.get("template_id") || undefined,
  };

  const parsed = createProposalSchema.safeParse(raw);
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

  // Check plan limits
  const profile = await getProfile(supabase, user.id);
  if (!profile) {
    return { error: "Profile not found" };
  }

  const plan = PLANS[profile.plan];
  if (plan.proposals_per_month > 0 && profile.proposal_count >= plan.proposals_per_month) {
    return { error: `You've reached your monthly limit of ${plan.proposals_per_month} proposals. Upgrade your plan for more.` };
  }

  // Resolve template
  let templateContent: TemplateContent | undefined;
  let colorPrimary: string | null = null;
  let colorAccent: string | null = null;
  let layout: string | null = null;
  const templateId = parsed.data.template_id;

  if (templateId && isSystemTemplateId(templateId)) {
    const systemTemplate = getSystemTemplate(templateId);
    if (systemTemplate) {
      templateContent = systemTemplate.content;
      colorPrimary = systemTemplate.content.color_scheme.primary;
      colorAccent = systemTemplate.content.color_scheme.accent;
      layout = systemTemplate.content.layout;
    }
  }

  // Auto-create or link client if client info is provided
  let clientId: string | null = null;
  const clientName = parsed.data.client_name ?? parsed.data.client_company;
  if (clientName) {
    try {
      // Check if a matching client already exists
      const existing = await findClientByEmailOrCompany(
        supabase,
        user.id,
        parsed.data.client_email ?? null,
        parsed.data.client_company ?? null
      );

      if (existing) {
        clientId = existing.id;
      } else {
        const newClient = await createClientRecord(supabase, {
          user_id: user.id,
          name: clientName,
          email: parsed.data.client_email ?? null,
          company: parsed.data.client_company ?? null,
          website: null,
          industry: null,
          phone: null,
          notes: null,
        });
        clientId = newClient.id;
      }
    } catch (err) {
      console.error("Auto-client creation failed:", err);
    }
  }

  const proposal = await createProposal(supabase, {
    user_id: user.id,
    title: parsed.data.client_company
      ? `${parsed.data.client_company} Proposal`
      : "New Proposal",
    status: "generating",
    client_brief: parsed.data.client_brief,
    client_name: parsed.data.client_name ?? null,
    client_email: parsed.data.client_email ?? null,
    client_company: parsed.data.client_company ?? null,
    client_id: clientId,
    template_id: parsed.data.template_id || null,
    template_color_primary: colorPrimary,
    template_color_accent: colorAccent,
    layout,
    valid_until: addDays(new Date(), PROPOSAL_VALIDITY_DAYS).toISOString().split("T")[0],
  });

  // Increment proposal count
  await supabase
    .from("profiles")
    .update({ proposal_count: profile.proposal_count + 1 })
    .eq("id", user.id);

  // Log activity (non-blocking — don't let logging failures break the flow)
  try {
    await logActivity(supabase, {
      user_id: user.id,
      proposal_id: proposal.id,
      action: `Created proposal "${proposal.title}"`,
      metadata: {},
    });
  } catch {
    // Activity logging is non-critical
  }

  // Kick off AI generation (fire-and-forget, updates via realtime)
  generateProposal(proposal.id, parsed.data, profile, templateContent).catch(console.error);

  redirect(`/proposals/${proposal.id}`);
}

export async function updateProposalAction(
  proposalId: string,
  data: Record<string, unknown>
): Promise<ActionResult> {
  const parsed = updateProposalSchema.safeParse(data);
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

  await updateProposal(supabase, proposalId, parsed.data);
  revalidatePath(`/proposals/${proposalId}`);
  return { success: true };
}

export async function deleteProposalAction(proposalId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  await deleteProposal(supabase, proposalId);

  try {
    await logActivity(supabase, {
      user_id: user.id,
      proposal_id: proposalId,
      action: "Deleted a proposal",
      metadata: {},
    });
  } catch {
    // Activity logging is non-critical
  }

  revalidatePath("/proposals");
  redirect("/proposals");
}

export async function duplicateProposalAction(proposalId: string): Promise<ActionResult | void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const original = await getProposal(supabase, proposalId);
  if (!original) {
    return { error: "Proposal not found" };
  }

  const duplicate = await createProposal(supabase, {
    user_id: user.id,
    title: `${original.title} (Copy)`,
    status: "draft",
    client_brief: original.client_brief,
    client_name: original.client_name,
    client_email: original.client_email,
    client_company: original.client_company,
    client_id: original.client_id,
    template_id: original.template_id,
    template_color_primary: original.template_color_primary,
    template_color_accent: original.template_color_accent,
    layout: original.layout,
    valid_until: addDays(new Date(), PROPOSAL_VALIDITY_DAYS).toISOString().split("T")[0],
  });

  // Copy content
  await updateProposal(supabase, duplicate.id, {
    executive_summary: original.executive_summary,
    understanding: original.understanding,
    scope_of_work: original.scope_of_work,
    deliverables: original.deliverables,
    timeline: original.timeline,
    investment: original.investment,
    terms: original.terms,
    about_us: original.about_us,
    custom_sections: original.custom_sections,
  });

  revalidatePath("/proposals");
  redirect(`/proposals/${duplicate.id}`);
}

export async function toggleShareAction(proposalId: string): Promise<{ shareUrl?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const proposal = await getProposal(supabase, proposalId);
  if (!proposal) {
    return { error: "Proposal not found" };
  }

  const shareToken = proposal.share_token ?? crypto.randomBytes(16).toString("hex");
  const shareEnabled = !proposal.share_enabled;

  await updateProposal(supabase, proposalId, {
    share_token: shareToken,
    share_enabled: shareEnabled,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return {
    shareUrl: shareEnabled ? `${baseUrl}/share/${shareToken}` : undefined,
  };
}

export async function updateProposalStatusAction(
  proposalId: string,
  status: string
): Promise<ActionResult> {
  const statusParsed = statusSchema.safeParse(status);
  if (!statusParsed.success) {
    return { error: "Invalid status" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const updates: Record<string, unknown> = { status: statusParsed.data };

  if (statusParsed.data === "sent") {
    updates.sent_at = new Date().toISOString();
  }
  if (statusParsed.data === "accepted" || statusParsed.data === "declined") {
    updates.responded_at = new Date().toISOString();
  }

  await updateProposal(supabase, proposalId, updates);

  try {
    await logActivity(supabase, {
      user_id: user.id,
      proposal_id: proposalId,
      action: `Proposal status changed to "${statusParsed.data}"`,
      metadata: { status: statusParsed.data },
    });
  } catch {
    // Activity logging is non-critical
  }

  revalidatePath(`/proposals/${proposalId}`);
  return { success: true };
}
