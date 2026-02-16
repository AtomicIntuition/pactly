"use client";

import { Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ListItemCard } from "./list-item-card";
import type { Proposal, Deliverable } from "@/types";

interface DeliverablesEditorProps {
  items: Deliverable[];
  updateField: <K extends keyof Proposal>(field: K, value: Proposal[K]) => void;
}

export function DeliverablesEditor({
  items,
  updateField,
}: DeliverablesEditorProps): React.ReactElement {
  const updateItem = (index: number, field: keyof Deliverable, value: string): void => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    updateField("deliverables", updated);
  };

  const removeItem = (index: number): void => {
    updateField("deliverables", items.filter((_, i) => i !== index));
  };

  const addItem = (): void => {
    updateField("deliverables", [...items, { title: "", description: "" }]);
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <h3 className="text-sm font-medium">Deliverables</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Items */}
      <div className="px-4 pb-4 space-y-3">
        {items.map((item, i) => (
          <ListItemCard
            key={i}
            index={i}
            onRemove={() => removeItem(i)}
            icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
          >
            <Input
              value={item.title}
              onChange={(e) => updateItem(i, "title", e.target.value)}
              placeholder="Deliverable title"
              className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-sm font-medium"
            />
            <Textarea
              value={item.description}
              onChange={(e) => updateItem(i, "description", e.target.value)}
              placeholder="Describe this deliverable..."
              className="border-0 shadow-none focus-visible:ring-0 resize-none p-0 text-sm min-h-[80px]"
            />
          </ListItemCard>
        ))}

        <Button variant="outline" className="w-full" onClick={addItem}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Deliverable
        </Button>
      </div>
    </div>
  );
}
