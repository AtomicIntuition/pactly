"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { UserMenu } from "@/components/app/user-menu";
import { Logo } from "@/components/shared/logo";
import type { Profile } from "@/types";
import { PLANS } from "@/lib/constants";

interface SidebarProps {
  profile: Profile;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/proposals", label: "Proposals", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
];

const bottomNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ profile, collapsed, onToggle }: SidebarProps): React.ReactElement {
  const pathname = usePathname();
  const plan = PLANS[profile.plan];
  const usagePercent =
    plan.proposals_per_month > 0
      ? Math.min((profile.proposal_count / plan.proposals_per_month) * 100, 100)
      : 0;

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size="md" showWordmark={!collapsed} />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onToggle}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150",
                isActive
                  ? "border-l-2 border-primary bg-primary/5 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <Separator className="my-4" />

        {bottomNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150",
                isActive
                  ? "border-l-2 border-primary bg-primary/5 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Plan usage card */}
      {!collapsed && profile.plan === "free" && (
        <div className="mx-3 mb-4 rounded-lg bg-secondary p-4">
          <p className="text-xs font-medium text-muted-foreground">Free Plan</p>
          <p className="mt-1 text-sm font-medium">
            {profile.proposal_count}/{plan.proposals_per_month} proposals
          </p>
          <Progress value={usagePercent} className="mt-2 h-1.5 [&>div]:bg-primary" />
          <Link href="/settings/billing">
            <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-xs text-primary">
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      )}

      {/* User section */}
      <div className="border-t p-3">
        <UserMenu profile={profile} collapsed={collapsed} />
      </div>
    </aside>
  );
}
