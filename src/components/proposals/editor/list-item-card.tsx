"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListItemCardProps {
  index: number;
  onRemove: () => void;
  icon?: React.ReactNode;
  indexLabel?: string;
  children: React.ReactNode;
}

export function ListItemCard({
  index,
  onRemove,
  icon,
  indexLabel,
  children,
}: ListItemCardProps): React.ReactElement {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-medium text-muted-foreground">
            {indexLabel ?? String(index + 1)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      {children}
    </div>
  );
}
