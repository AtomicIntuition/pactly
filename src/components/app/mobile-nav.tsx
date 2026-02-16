"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "@/components/app/sidebar";
import type { Profile } from "@/types";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
}

export function MobileNav({ open, onOpenChange, profile }: MobileNavProps): React.ReactElement {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 w-64">
        <Sidebar profile={profile} collapsed={false} onToggle={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
