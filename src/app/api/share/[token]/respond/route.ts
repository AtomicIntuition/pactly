import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendResponseNotification } from "@/lib/email/send";
import { z } from "zod";

const respondSchema = z.object({
  accepted: z.boolean(),
  signature_name: z.string().min(1).optional(),
});

interface ProposalRow {
  id: string;
  user_id: string;
  title: string;
  client_name: string | null;
  client_email: string | null;
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
    .select("id, user_id, title, client_name, client_email")
    .eq("share_token", token)
    .eq("share_enabled", true)
    .single();

  const proposal = data as ProposalRow | null;

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const newStatus = parsed.data.accepted ? "accepted" : "declined";
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const updates: Record<string, unknown> = {
    status: newStatus,
    responded_at: new Date().toISOString(),
  };

  if (parsed.data.accepted && parsed.data.signature_name) {
    updates.signature_name = parsed.data.signature_name;
    updates.signature_ip = clientIp;
    updates.signed_at = new Date().toISOString();
  }

  await supabase
    .from("proposals")
    .update(updates)
    .eq("id", proposal.id);

  // Log activity
  await supabase.from("activity_log").insert({
    user_id: proposal.user_id,
    proposal_id: proposal.id,
    action: `Proposal "${proposal.title}" was ${newStatus} by the client`,
    metadata: { status: newStatus },
  } as Record<string, unknown>);

  // Send notification email to proposal owner (non-critical)
  try {
    const { data: ownerProfile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", proposal.user_id)
      .single();

    if (ownerProfile?.email) {
      await sendResponseNotification({
        to: ownerProfile.email as string,
        proposalTitle: proposal.title,
        clientName: parsed.data.signature_name ?? proposal.client_name ?? "Client",
        accepted: parsed.data.accepted,
      });
    }
  } catch {
    // Email notification is non-critical
  }

  return NextResponse.json({ success: true });
}
