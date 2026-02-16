import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getProposalByShareToken,
  getProfile,
  incrementProposalViewCount,
} from "@/lib/supabase/queries";
import { SharedProposalView } from "@/components/share/shared-proposal-view";
import type { Proposal, Profile } from "@/types";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const supabase = createAdminClient();
  const proposal = await getProposalByShareToken(supabase, token);

  if (!proposal) return { title: "Proposal Not Found" };

  return {
    title: proposal.title,
    description: `Proposal for ${proposal.client_company ?? "you"}`,
  };
}

export default async function SharedProposalPage({ params }: Props): Promise<React.ReactElement> {
  const { token } = await params;
  const supabase = createAdminClient();

  // Fetch proposal using the data access layer
  const proposal = await getProposalByShareToken(supabase, token);

  if (!proposal) return notFound();

  // Increment view count using the admin client (shared page, no auth context)
  await incrementProposalViewCount(supabase, proposal.id);

  // Fetch the owner's profile for branding
  const profile = await getProfile(supabase, proposal.user_id);

  // If profile is null, build a minimal fallback to avoid crash
  const safeProfile: Profile = profile ?? {
    id: proposal.user_id,
    full_name: "",
    email: "",
    company_name: null,
    company_logo_url: null,
    brand_color: "#1e40af",
    brand_accent: "#1e40af",
    website: null,
    phone: null,
    address: null,
    bio: null,
    plan: "free",
    stripe_customer_id: null,
    stripe_subscription_id: null,
    proposal_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <SharedProposalView
      proposal={proposal as Proposal}
      profile={safeProfile}
      token={token}
    />
  );
}
