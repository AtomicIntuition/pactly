import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { BrandForm } from "@/components/settings/brand-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Brand Settings",
};

async function BrandData(): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfile(supabase, user.id);

  if (!profile) redirect("/login");

  return (
    <BrandForm
      brandColor={profile.brand_color}
      brandAccent={profile.brand_accent}
      companyName={profile.company_name}
    />
  );
}

export default function BrandSettingsPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Brand Settings"
        description="Customize your proposal branding to match your company identity."
      />
      <Suspense
        fallback={
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        }
      >
        <BrandData />
      </Suspense>
    </div>
  );
}
