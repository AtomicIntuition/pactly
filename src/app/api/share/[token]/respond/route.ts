import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const respondSchema = z.object({
  accepted: z.boolean(),
});

interface ProposalRow {
  id: string;
  user_id: string;
  title: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
): Promise<NextResponse> {
  const { token } = await params;

  const body = await request.json();
  const parsed = respondSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data } = await supabase
    .from("proposals")
    .select("id, user_id, title")
    .eq("share_token", token)
    .eq("share_enabled", true)
    .single();

  const proposal = data as ProposalRow | null;

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const newStatus = parsed.data.accepted ? "accepted" : "declined";

  await supabase
    .from("proposals")
    .update({
      status: newStatus,
      responded_at: new Date().toISOString(),
    } as Record<string, unknown>)
    .eq("id", proposal.id);

  // Log activity
  await supabase.from("activity_log").insert({
    user_id: proposal.user_id,
    proposal_id: proposal.id,
    action: `Proposal "${proposal.title}" was ${newStatus} by the client`,
    metadata: { status: newStatus },
  } as Record<string, unknown>);

  return NextResponse.json({ success: true });
}
