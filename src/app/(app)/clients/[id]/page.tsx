import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getClient, getProposalsByClient } from "@/lib/supabase/queries";
import { ClientDetail } from "@/components/clients/client-detail";
import { ClientDetailSkeleton } from "@/components/shared/loading-skeleton";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const client = await getClient(supabase, id);
  return {
    title: client?.name ?? "Client",
  };
}

async function ClientDetailContent({ id }: { id: string }): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  const [client, proposals] = await Promise.all([
    getClient(supabase, id),
    getProposalsByClient(supabase, id),
  ]);

  if (!client) return notFound();

  return <ClientDetail client={client} proposals={proposals} />;
}

export default async function ClientPage({ params }: Props): Promise<React.ReactElement> {
  const { id } = await params;
  return (
    <Suspense fallback={<ClientDetailSkeleton />}>
      <ClientDetailContent id={id} />
    </Suspense>
  );
}
