import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProfile } from "@/lib/supabase/queries";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let profile = await getProfile(supabase, user.id);

  // Auto-create profile if trigger didn't fire (e.g. admin-created users)
  if (!profile) {
    const admin = createAdminClient();
    await admin.from("profiles").insert({
      id: user.id,
      full_name: user.user_metadata?.full_name ?? "",
      email: user.email ?? "",
    });

    profile = await getProfile(supabase, user.id);
  }

  if (!profile) {
    redirect("/login");
  }

  return <AppShell profile={profile}>{children}</AppShell>;
}
