import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Profile,
  Client,
  Proposal,
  ActivityLog,
  ProposalStatus,
} from "@/types";

// ─── Profile Queries ──────────────────────────────────────

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data as Profile;
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Profile;
}

// ─── Client Queries ───────────────────────────────────────

export async function getClients(
  supabase: SupabaseClient,
  userId: string
): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Client[];
}

export async function getClient(
  supabase: SupabaseClient,
  clientId: string
): Promise<Client | null> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (error) return null;
  return data as Client;
}

export async function createClient(
  supabase: SupabaseClient,
  client: Omit<Client, "id" | "created_at" | "updated_at" | "proposal_count" | "total_value_cents">
): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .insert(client)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Client;
}

export async function updateClient(
  supabase: SupabaseClient,
  clientId: string,
  updates: Partial<Client>
): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", clientId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Client;
}

export async function deleteClient(
  supabase: SupabaseClient,
  clientId: string
): Promise<void> {
  const { error } = await supabase.from("clients").delete().eq("id", clientId);
  if (error) throw new Error(error.message);
}

export async function findClientByEmailOrCompany(
  supabase: SupabaseClient,
  userId: string,
  email: string | null,
  company: string | null
): Promise<Client | null> {
  // Try matching by email first (most specific)
  if (email) {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", userId)
      .eq("email", email)
      .limit(1)
      .maybeSingle();
    if (data) return data as Client;
  }
  // Fall back to matching by company name
  if (company) {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", userId)
      .eq("company", company)
      .limit(1)
      .maybeSingle();
    if (data) return data as Client;
  }
  return null;
}

// ─── Proposal Queries ─────────────────────────────────────

export async function getProposals(
  supabase: SupabaseClient,
  userId: string,
  options?: {
    status?: ProposalStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ proposals: Proposal[]; count: number }> {
  let query = supabase
    .from("proposals")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.search) {
    const sanitized = options.search.replace(/[%_.,()]/g, "");
    if (sanitized.length > 0) {
      query = query.or(
        `title.ilike.%${sanitized}%,client_name.ilike.%${sanitized}%,client_company.ilike.%${sanitized}%`
      );
    }
  }
  const limit = options?.limit ?? 10;
  if (options?.offset) {
    query = query.range(options.offset, options.offset + limit - 1);
  } else {
    query = query.limit(limit);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);
  return { proposals: (data ?? []) as Proposal[], count: count ?? 0 };
}

export async function getProposal(
  supabase: SupabaseClient,
  proposalId: string
): Promise<Proposal | null> {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", proposalId)
    .single();

  if (error) return null;
  return data as Proposal;
}

export async function getProposalsByClient(
  supabase: SupabaseClient,
  clientId: string
): Promise<Proposal[]> {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("client_id", clientId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Proposal[];
}

export async function getProposalByShareToken(
  supabase: SupabaseClient,
  shareToken: string
): Promise<Proposal | null> {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("share_token", shareToken)
    .eq("share_enabled", true)
    .single();

  if (error) return null;
  return data as Proposal;
}

export async function createProposal(
  supabase: SupabaseClient,
  proposal: Pick<
    Proposal,
    "user_id" | "title" | "status" | "client_brief" | "client_name" | "client_email" | "client_company" | "client_id" | "template_id" | "valid_until"
  > & { template_color_primary?: string | null; template_color_accent?: string | null; layout?: string | null }
): Promise<Proposal> {
  const { data, error } = await supabase
    .from("proposals")
    .insert(proposal)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Proposal;
}

export async function updateProposal(
  supabase: SupabaseClient,
  proposalId: string,
  updates: Partial<Proposal>
): Promise<Proposal> {
  const { data, error } = await supabase
    .from("proposals")
    .update(updates)
    .eq("id", proposalId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Proposal;
}

export async function deleteProposal(
  supabase: SupabaseClient,
  proposalId: string
): Promise<void> {
  const { error } = await supabase.from("proposals").delete().eq("id", proposalId);
  if (error) throw new Error(error.message);
}

export async function incrementProposalViewCount(
  supabase: SupabaseClient,
  proposalId: string
): Promise<void> {
  const { error } = await supabase.rpc("increment_view_count", {
    proposal_id: proposalId,
  });
  // Fallback if RPC doesn't exist — fetch current count and increment
  if (error) {
    const { data: current } = await supabase
      .from("proposals")
      .select("view_count")
      .eq("id", proposalId)
      .single();

    const currentCount = (current as { view_count?: number } | null)?.view_count ?? 0;

    await supabase
      .from("proposals")
      .update({
        view_count: currentCount + 1,
        viewed_at: new Date().toISOString(),
      })
      .eq("id", proposalId);
  }
}

// ─── Activity Log Queries ─────────────────────────────────

export async function getActivityLog(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 10
): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as ActivityLog[];
}

export async function logActivity(
  supabase: SupabaseClient,
  activity: Pick<ActivityLog, "user_id" | "proposal_id" | "action" | "metadata">
): Promise<void> {
  const { error } = await supabase.from("activity_log").insert(activity);
  if (error) throw new Error(error.message);
}

// ─── Dashboard Queries ────────────────────────────────────

export async function getDashboardStats(
  supabase: SupabaseClient,
  userId: string
): Promise<{
  totalProposals: number;
  pendingReview: number;
  acceptedThisMonth: number;
  revenueThisMonth: number;
  proposalsThisWeek: number;
  acceptanceRate: number;
  revenueChange: number;
}> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfWeekStr = startOfWeek.toISOString();

  const [totalRes, pendingRes, acceptedRes, weekRes, lastMonthAccepted, allTimeAcceptedRes] = await Promise.all([
    supabase.from("proposals").select("id", { count: "exact" }).eq("user_id", userId),
    supabase
      .from("proposals")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .in("status", ["review", "sent"]),
    supabase
      .from("proposals")
      .select("investment")
      .eq("user_id", userId)
      .eq("status", "accepted")
      .gte("responded_at", startOfMonth),
    supabase
      .from("proposals")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .gte("created_at", startOfWeekStr),
    supabase
      .from("proposals")
      .select("investment")
      .eq("user_id", userId)
      .eq("status", "accepted")
      .gte("responded_at", startOfLastMonth)
      .lte("responded_at", endOfLastMonth),
    supabase
      .from("proposals")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .eq("status", "accepted"),
  ]);

  const revenueThisMonth = (acceptedRes.data ?? []).reduce((sum, p) => {
    const inv = p.investment as { total_cents?: number } | null;
    return sum + (inv?.total_cents ?? 0);
  }, 0);

  const revenueLastMonth = (lastMonthAccepted.data ?? []).reduce((sum, p) => {
    const inv = p.investment as { total_cents?: number } | null;
    return sum + (inv?.total_cents ?? 0);
  }, 0);

  const totalProposals = totalRes.count ?? 0;
  const acceptedThisMonth = acceptedRes.data?.length ?? 0;
  const allTimeAccepted = allTimeAcceptedRes.count ?? 0;

  return {
    totalProposals,
    pendingReview: pendingRes.count ?? 0,
    acceptedThisMonth,
    revenueThisMonth,
    proposalsThisWeek: weekRes.count ?? 0,
    acceptanceRate: totalProposals > 0 ? Math.round((allTimeAccepted / totalProposals) * 100) : 0,
    revenueChange: revenueThisMonth - revenueLastMonth,
  };
}
