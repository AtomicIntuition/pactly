import type { Metadata } from "next";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Team",
};

export default function TeamPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Invite team members to collaborate on proposals."
      />

      <Card className="rounded-xl border bg-card p-12 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Users className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Team Management</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Invite team members, assign roles, and collaborate on proposals
            together.
          </p>
          <Badge variant="secondary" className="mt-4">
            Coming soon on the Agency plan
          </Badge>
        </div>
      </Card>
    </div>
  );
}
