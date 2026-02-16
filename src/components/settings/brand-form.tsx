"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { updateBrandAction } from "@/actions/settings";

interface BrandFormProps {
  brandColor: string;
  brandAccent: string;
  companyName: string | null;
}

export function BrandForm({
  brandColor,
  brandAccent,
  companyName,
}: BrandFormProps): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(brandColor);
  const [accent, setAccent] = useState(brandAccent);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    const result = await updateBrandAction({
      brand_color: color,
      brand_accent: accent,
    });

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Brand colors updated");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-medium">Brand Colors</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          These colors will be used in your proposal headers and accents.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brand_color">Primary Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="brand_color_picker"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
              />
              <Input
                id="brand_color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#000000"
                className="font-mono"
                maxLength={7}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand_accent">Accent Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="brand_accent_picker"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
              />
              <Input
                id="brand_accent"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                placeholder="#000000"
                className="font-mono"
                maxLength={7}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Colors
            </Button>
          </div>
        </form>
      </Card>

      <Card className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-medium">Preview</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          This is how your proposal header will look.
        </p>
        <div className="mt-6 overflow-hidden rounded-lg border">
          <div
            className="px-6 py-8"
            style={{ backgroundColor: color }}
          >
            <p
              className="text-lg font-semibold"
              style={{ color: accent }}
            >
              {companyName || "Your Company"}
            </p>
            <p className="mt-1 text-sm text-white/80">
              Project Proposal
            </p>
          </div>
          <div className="space-y-3 p-6">
            <div
              className="h-2 w-3/4 rounded"
              style={{ backgroundColor: color, opacity: 0.2 }}
            />
            <div
              className="h-2 w-1/2 rounded"
              style={{ backgroundColor: color, opacity: 0.15 }}
            />
            <div
              className="h-2 w-5/6 rounded"
              style={{ backgroundColor: color, opacity: 0.1 }}
            />
            <div className="mt-4 flex gap-2">
              <div
                className="rounded px-3 py-1.5 text-xs font-medium text-white"
                style={{ backgroundColor: color }}
              >
                View Details
              </div>
              <div
                className="rounded border px-3 py-1.5 text-xs font-medium"
                style={{ borderColor: accent, color: accent }}
              >
                Download PDF
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
