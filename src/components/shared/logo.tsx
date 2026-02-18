import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: { icon: "h-4 w-4", text: "text-sm" },
  md: { icon: "h-5 w-5", text: "text-lg" },
  lg: { icon: "h-8 w-8", text: "text-2xl" },
} as const;

interface LogoProps {
  size?: keyof typeof sizes;
  showWordmark?: boolean;
  className?: string;
}

export function Logo({ size = "md", showWordmark = true, className }: LogoProps): React.ReactElement {
  const s = sizes[size];
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Sparkles className={cn(s.icon, "text-primary")} />
      {showWordmark && (
        <span className={cn(s.text, "font-semibold tracking-tight")}>Overture</span>
      )}
    </span>
  );
}
