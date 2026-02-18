"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, Circle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";
import { createClient } from "@/lib/supabase/client";
import { GENERATION_STEPS } from "@/lib/constants";
import type { GenerationMetadata } from "@/types";

interface GenerationProgressProps {
  proposal: { id: string; generation_metadata: GenerationMetadata | null };
}

export function GenerationProgress({ proposal }: GenerationProgressProps): React.ReactElement {
  const router = useRouter();
  const [metadata, setMetadata] = useState<GenerationMetadata | null>(
    proposal.generation_metadata
  );
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    const supabase = createClient();

    const poll = async (): Promise<void> => {
      if (cancelledRef.current) return;

      try {
        const { data } = await supabase
          .from("proposals")
          .select("status, generation_metadata")
          .eq("id", proposal.id)
          .single();

        if (cancelledRef.current || !data) return;

        const row = data as { status: string; generation_metadata: GenerationMetadata | null };
        setMetadata(row.generation_metadata);

        if (row.status !== "generating") {
          cancelledRef.current = true;
          // Brief delay so the user sees 100% before navigating
          setTimeout(() => router.refresh(), 800);
        }
      } catch {
        // Request may fail if component unmounts mid-fetch — safe to ignore
      }
    };

    // Immediate first poll, then every 2 seconds
    poll();
    const interval = setInterval(poll, 2000);

    return () => {
      cancelledRef.current = true;
      clearInterval(interval);
    };
  }, [proposal.id, router]);

  const completedSteps = metadata?.completed_steps ?? [];
  const currentStep = metadata?.current_step ?? "Starting...";
  const progress = metadata?.progress ?? 5;
  const hasError = metadata?.error;

  if (hasError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="mt-4 text-lg font-medium">Generation failed</h2>
        <p className="mt-1 text-sm text-muted-foreground">{hasError}</p>
        <Button className="mt-6" onClick={() => router.refresh()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20">
      <Card className="w-full rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="animate-pulse">
            <Logo size="lg" showWordmark={false} />
          </div>
          <h2 className="mt-4 text-lg font-medium">Generating your proposal...</h2>

          {/* Progress bar */}
          <div className="mt-6 w-full">
            <div className="relative">
              <Progress value={progress} className="h-2 [&>div]:bg-primary" />
              <div className="absolute inset-0 h-2 rounded-full animate-shimmer" />
            </div>
            <p className="mt-2 text-right text-xs text-muted-foreground font-mono tabular-nums">
              {progress}%
            </p>
          </div>

          {/* Steps list */}
          <div className="mt-6 w-full space-y-3 text-left">
            {GENERATION_STEPS.map((step) => {
              const isCompleted = completedSteps.includes(step);
              const isCurrent = currentStep === step;

              return (
                <div key={step} className="flex items-center gap-3 text-sm">
                  {isCompleted ? (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  ) : isCurrent ? (
                    <Circle className="h-4 w-4 shrink-0 text-primary animate-pulse-dot" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                  )}
                  <span
                    className={
                      isCompleted
                        ? "text-foreground"
                        : isCurrent
                          ? "text-foreground font-medium"
                          : "text-muted-foreground/50"
                    }
                  >
                    {isCurrent ? `${step}...` : step}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">Usually takes 30-60 seconds</p>
        </div>
      </Card>
    </div>
  );
}
