import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProposals } from "@/lib/supabase/queries";
import { ProposalsList } from "@/components/proposals/proposals-list";
import { ProposalListSkeleton } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Proposals",
};

interface Props {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}

async function ProposalsData({ searchParams }: Props): Promise<React.ReactElement> {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <div />;

  const page = parseInt(params.page ?? "1", 10);
  const limit = 10;
  const offset = (page - 1) * limit;

  const { proposals, count } = await getProposals(supabase, user.id, {
    status: params.status as import("@/types").ProposalStatus | undefined,
    search: params.search,
    limit,
    offset,
  });

  return (
    <ProposalsList
      proposals={proposals}
      totalCount={count}
      currentPage={page}
      currentStatus={params.status}
      currentSearch={params.search}
    />
  );
}

export default async function ProposalsPage({ searchParams }: Props): Promise<React.ReactElement> {
  return (
    <Suspense fallback={<ProposalListSkeleton />}>
      <ProposalsData searchParams={searchParams} />
    </Suspense>
  );
}
