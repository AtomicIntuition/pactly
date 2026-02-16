import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getClients } from "@/lib/supabase/queries";
import { ClientsContent } from "@/components/clients/clients-content";
import { ClientsSkeleton } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Clients",
};

async function ClientsData(): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <div />;

  const clients = await getClients(supabase, user.id);
  return <ClientsContent clients={clients} />;
}

export default function ClientsPage(): React.ReactElement {
  return (
    <Suspense fallback={<ClientsSkeleton />}>
      <ClientsData />
    </Suspense>
  );
}
