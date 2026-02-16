"use client";

import { ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface SectionEditorProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  onRegenerate?: () => void;
  defaultOpen?: boolean;
  minHeight?: string;
  icon?: React.ReactNode;
  accentBorder?: boolean;
}

export function SectionEditor({
  title,
  value,
  onChange,
  onRegenerate,
  defaultOpen = true,
  minHeight = "160px",
  icon,
  accentBorder,
}: SectionEditorProps): React.ReactElement {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <div
        className={cn(
          "rounded-xl border bg-card shadow-sm",
          accentBorder && "border-l-4 border-l-primary",
        )}
      >
        <CollapsibleTrigger asChild>
          <div className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors duration-150">
            <div className="flex items-center gap-2">
              {icon && (
                <span className="text-muted-foreground">{icon}</span>
              )}
              <h3 className="text-sm font-medium">{title}</h3>
              {wordCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {wordCount} words
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {onRegenerate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegenerate();
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform [[data-state=open]>&]:rotate-180" />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t px-4 py-3">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 resize-y p-0 text-sm"
              style={{ minHeight }}
            />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
