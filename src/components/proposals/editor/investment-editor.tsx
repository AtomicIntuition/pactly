"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { LineItem } from "@/types";

interface InvestmentEditorProps {
  lineItems: LineItem[];
  totalCents: number;
  updateLineItem: (index: number, field: keyof LineItem, value: string | number) => void;
  addLineItem: () => void;
  removeLineItem: (index: number) => void;
}

export function InvestmentEditor({
  lineItems,
  totalCents,
  updateLineItem,
  addLineItem,
  removeLineItem,
}: InvestmentEditorProps): React.ReactElement {
  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(totalCents / 100);

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <h3 className="text-sm font-medium">Investment</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {lineItems.length} {lineItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Line items */}
      <div className="px-4 space-y-2">
        {lineItems.map((item, i) => (
          <div key={i} className="grid gap-2 grid-cols-[1fr_auto_auto] group">
            <Input
              value={item.description}
              onChange={(e) => updateLineItem(i, "description", e.target.value)}
              placeholder="Description"
              className="h-10 text-sm"
            />
            <div className="relative w-36">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                value={item.amount_cents / 100}
                onChange={(e) =>
                  updateLineItem(i, "amount_cents", Math.round(parseFloat(e.target.value || "0") * 100))
                }
                className="h-10 pl-7 text-sm font-mono tabular-nums"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              onClick={() => removeLineItem(i)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <div className="px-4 py-3">
        <Button variant="outline" className="w-full" onClick={addLineItem}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Line Item
        </Button>
      </div>

      {/* Total */}
      <Separator />
      <div className="flex items-center justify-between bg-primary/5 px-4 py-4">
        <span className="text-sm font-medium text-muted-foreground">Total Investment</span>
        <span className="text-2xl font-bold font-mono tabular-nums">{formattedTotal}</span>
      </div>
    </div>
  );
}
