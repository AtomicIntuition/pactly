import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/settings/profile-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Settings",
};

async function ProfileData(): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfile(supabase, user.id);

  if (!profile) redirect("/login");

  return <ProfileForm profile={profile} />;
}

export default function SettingsPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile and account preferences."
      />
      <Suspense
        fallback={
          <div className="space-y-6">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-24 w-full max-w-md" />
            <Skeleton className="h-10 w-32" />
          </div>
        }
      >
        <ProfileData />
      </Suspense>
    </div>
  );
}
