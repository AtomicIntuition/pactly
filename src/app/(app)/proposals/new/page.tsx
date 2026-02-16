import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { ClientBriefInput } from "@/components/proposals/client-brief-input";

export const metadata: Metadata = {
  title: "Create a Proposal",
};

export default async function NewProposalPage(): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <div />;

  const profile = await getProfile(supabase, user.id);

  return (
    <ClientBriefInput
      proposalCount={profile?.proposal_count ?? 0}
      planLimit={profile ? (profile.plan === "free" ? 5 : profile.plan === "pro" ? 50 : -1) : 5}
    />
  );
}
