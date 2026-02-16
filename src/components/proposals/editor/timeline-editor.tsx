"use client";

import { Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ListItemCard } from "./list-item-card";
import type { Proposal, TimelinePhase } from "@/types";

interface TimelineEditorProps {
  items: TimelinePhase[];
  updateField: <K extends keyof Proposal>(field: K, value: Proposal[K]) => void;
}

export function TimelineEditor({
  items,
  updateField,
}: TimelineEditorProps): React.ReactElement {
  const updateItem = (index: number, field: keyof TimelinePhase, value: string): void => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    updateField("timeline", updated);
  };

  const removeItem = (index: number): void => {
    updateField("timeline", items.filter((_, i) => i !== index));
  };

  const addItem = (): void => {
    updateField("timeline", [...items, { phase: "", duration: "", description: "" }]);
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <h3 className="text-sm font-medium">Timeline</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "phase" : "phases"}
        </span>
      </div>

      {/* Phases */}
      <div className="px-4 pb-4 space-y-3">
        {items.map((phase, i) => (
          <ListItemCard
            key={i}
            index={i}
            onRemove={() => removeItem(i)}
            icon={
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {i + 1}
              </span>
            }
            indexLabel={`Phase ${i + 1}`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                value={phase.phase}
                onChange={(e) => updateItem(i, "phase", e.target.value)}
                placeholder="Phase name"
                className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-sm font-medium flex-1"
              />
              <div className="flex items-center gap-1.5 sm:w-32">
                <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <Input
                  value={phase.duration}
                  onChange={(e) => updateItem(i, "duration", e.target.value)}
                  placeholder="Duration"
                  className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-sm"
                />
              </div>
            </div>
            <Textarea
              value={phase.description}
              onChange={(e) => updateItem(i, "description", e.target.value)}
              placeholder="Describe what happens in this phase..."
              className="border-0 shadow-none focus-visible:ring-0 resize-none p-0 text-sm min-h-[80px]"
            />
          </ListItemCard>
        ))}

        <Button variant="outline" className="w-full" onClick={addItem}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Phase
        </Button>
      </div>
    </div>
  );
}
