import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProposal } from "@/lib/supabase/queries";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Preview Proposal",
};

export default async function ProposalPreviewPage({ params }: Props): Promise<React.ReactElement> {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  const proposal = await getProposal(supabase, id);
  if (!proposal) return notFound();

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <iframe
          src={`/api/proposals/${proposal.id}/pdf#toolbar=0&navpanes=0`}
          className="w-full"
          style={{ aspectRatio: "210 / 297", minHeight: 700 }}
          title="PDF Preview"
        />
      </div>
    </div>
  );
}
