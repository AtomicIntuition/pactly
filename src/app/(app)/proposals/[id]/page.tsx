import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProposal, getProfile } from "@/lib/supabase/queries";
import { GenerationProgress } from "@/components/proposals/generation-progress";
import { ProposalEditor } from "@/components/proposals/proposal-editor";
import { ProposalEditorSkeleton } from "@/components/shared/loading-skeleton";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const proposal = await getProposal(supabase, id);
  return {
    title: proposal?.title ?? "Proposal",
  };
}

async function ProposalContent({ id }: { id: string }): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  const [proposal, profile] = await Promise.all([
    getProposal(supabase, id),
    getProfile(supabase, user.id),
  ]);

  if (!proposal || !profile) return notFound();

  if (proposal.status === "generating") {
    return <GenerationProgress proposal={proposal} />;
  }

  return <ProposalEditor proposal={proposal} profile={profile} />;
}

export default async function ProposalPage({ params }: Props): Promise<React.ReactElement> {
  const { id } = await params;
  return (
    <Suspense fallback={<ProposalEditorSkeleton />}>
      <ProposalContent id={id} />
    </Suspense>
  );
}
