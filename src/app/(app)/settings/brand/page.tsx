import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { BrandForm } from "@/components/settings/brand-form";
import { LogoUpload } from "@/components/settings/logo-upload";
import { Card } from "@/components/ui/card";
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
    <div className="space-y-6">
      <Card className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-medium">Company Logo</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Your logo appears on proposals, PDFs, and shared links. PNG, JPEG, or WebP up to 2MB.
        </p>
        <div className="mt-4">
          <LogoUpload currentLogoUrl={profile.company_logo_url} />
        </div>
      </Card>
      <BrandForm
        brandColor={profile.brand_color}
        brandAccent={profile.brand_accent}
        companyName={profile.company_name}
      />
    </div>
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
          <div className="space-y-6">
            <Skeleton className="h-28 rounded-xl" />
            <div className="grid gap-6 lg:grid-cols-2">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          </div>
        }
      >
        <BrandData />
      </Suspense>
    </div>
  );
}
