"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { Proposal } from "@/types";
import type { ProposalLayout } from "@/lib/templates/types";

const LAYOUTS: { value: ProposalLayout; label: string; icon: React.ReactNode }[] = [
  {
    value: "modern",
    label: "Modern",
    icon: (
      <svg viewBox="0 0 32 40" className="h-full w-full" aria-hidden="true">
        <rect x="0" y="0" width="32" height="10" rx="1" className="fill-foreground/80" />
        <rect x="2" y="13" width="12" height="1.5" rx="0.5" className="fill-foreground/20" />
        <rect x="2" y="16" width="28" height="1" rx="0.5" className="fill-foreground/10" />
        <rect x="2" y="18.5" width="28" height="1" rx="0.5" className="fill-foreground/10" />
        <rect x="2" y="21" width="20" height="1" rx="0.5" className="fill-foreground/10" />
      </svg>
    ),
  },
  {
    value: "classic",
    label: "Classic",
    icon: (
      <svg viewBox="0 0 32 40" className="h-full w-full" aria-hidden="true">
        <rect x="0" y="0" width="32" height="3" rx="0.5" className="fill-foreground/60" />
        <rect x="8" y="6" width="16" height="2" rx="0.5" className="fill-foreground/30" />
        <rect x="10" y="10" width="12" height="1" rx="0.5" className="fill-foreground/15" />
        <rect x="2" y="15" width="28" height="1" rx="0.5" className="fill-foreground/10" />
        <rect x="2" y="17.5" width="28" height="1" rx="0.5" className="fill-foreground/10" />
        <rect x="2" y="20" width="20" height="1" rx="0.5" className="fill-foreground/10" />
      </svg>
    ),
  },
  {
    value: "bold",
    label: "Bold",
    icon: (
      <svg viewBox="0 0 32 40" className="h-full w-full" aria-hidden="true">
        <circle cx="16" cy="8" r="6" className="fill-foreground/70" />
        <rect x="6" y="17" width="20" height="2" rx="0.5" className="fill-foreground/25" />
        <rect x="2" y="22" width="28" height="1" rx="0.5" className="fill-foreground/10" />
        <rect x="2" y="24.5" width="28" height="1" rx="0.5" className="fill-foreground/10" />
        <rect x="2" y="27" width="20" height="1" rx="0.5" className="fill-foreground/10" />
      </svg>
    ),
  },
  {
    value: "minimal",
    label: "Minimal",
    icon: (
      <svg viewBox="0 0 32 40" className="h-full w-full" aria-hidden="true">
        <rect x="2" y="4" width="14" height="1.5" rx="0.5" className="fill-foreground/30" />
        <rect x="2" y="7.5" width="8" height="1" rx="0.5" className="fill-foreground/15" />
        <rect x="0" y="11" width="32" height="0.5" className="fill-foreground/10" />
        <rect x="2" y="14" width="28" height="1" rx="0.5" className="fill-foreground/10" />
        <rect x="2" y="16.5" width="28" height="1" rx="0.5" className="fill-foreground/10" />
        <rect x="2" y="19" width="20" height="1" rx="0.5" className="fill-foreground/10" />
      </svg>
    ),
  },
];

interface DesignControlsProps {
  proposal: Proposal;
  updateField: <K extends keyof Proposal>(field: K, value: Proposal[K]) => void;
}

export function DesignControls({
  proposal,
  updateField,
}: DesignControlsProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  const currentLayout = (proposal.layout as ProposalLayout) || "modern";
  const primaryColor = proposal.template_color_primary || "";
  const accentColor = proposal.template_color_accent || "";

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-xl border bg-card shadow-sm">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-3.5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Design</span>
            <span className="text-xs text-muted-foreground">
              {LAYOUTS.find((l) => l.value === currentLayout)?.label ?? "Modern"} layout
            </span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t px-5 pb-5 pt-4 space-y-5">
            {/* Layout picker */}
            <div className="space-y-2">
              <Label className="text-xs">Layout</Label>
              <div className="grid grid-cols-4 gap-2">
                {LAYOUTS.map((layout) => (
                  <button
                    key={layout.value}
                    type="button"
                    onClick={() => updateField("layout", layout.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-all hover:border-foreground/20",
                      currentLayout === layout.value &&
                        "ring-2 ring-primary ring-offset-2 border-primary"
                    )}
                  >
                    <div className="h-10 w-8">{layout.icon}</div>
                    <span className="text-[10px] font-medium">{layout.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color pickers */}
            <div className="space-y-3">
              <Label className="text-xs">Colors</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Primary</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor || "#0f172a"}
                      onChange={(e) => updateField("template_color_primary", e.target.value)}
                      className="h-9 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => updateField("template_color_primary", e.target.value)}
                      placeholder="Brand default"
                      className="font-mono text-xs h-9"
                      maxLength={7}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Accent</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor || "#3b82f6"}
                      onChange={(e) => updateField("template_color_accent", e.target.value)}
                      className="h-9 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                    <Input
                      value={accentColor}
                      onChange={(e) => updateField("template_color_accent", e.target.value)}
                      placeholder="Brand default"
                      className="font-mono text-xs h-9"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>
              {(primaryColor || accentColor) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    updateField("template_color_primary", null);
                    updateField("template_color_accent", null);
                  }}
                >
                  <RotateCcw className="mr-1.5 h-3 w-3" />
                  Reset to brand defaults
                </Button>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
