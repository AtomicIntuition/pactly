import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatsCard({ label, value, subtext, trend }: StatsCardProps): React.ReactElement {
  return (
    <Card className="rounded-xl border bg-card p-6 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold font-mono tabular-nums">{value}</p>
      {subtext && (
        <p
          className={cn(
            "mt-1 text-xs text-muted-foreground",
            trend === "up" && "text-success",
            trend === "down" && "text-destructive"
          )}
        >
          {subtext}
        </p>
      )}
    </Card>
  );
}
