import Link from "next/link";
import { ArrowRight, Clock, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero(): React.ReactElement {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle gold gradient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-24 md:px-6 md:py-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Star className="h-3 w-3" />
            Trusted by 2,400+ agencies
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Your next proposal, in{" "}
            <span className="text-gradient-gold">sixty seconds</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Paste any client brief. Overture researches, writes, and designs a polished
            proposal — ready to send before your coffee gets cold.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8 gap-2">
                Start Free — No Card Required
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" size="lg" className="text-base">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              60-second generation
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              2,400+ agencies
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-primary" />
              4.9/5 early users
            </span>
          </div>
        </div>

        {/* Product screenshot mockup */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="rounded-lg border border-border/50 bg-card shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="flex items-center gap-2 border-b px-4 py-3 bg-secondary/50">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground">useoverture.com/proposals/editor</span>
              </div>
            </div>
            <div className="aspect-video bg-gradient-to-br from-secondary to-background flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="text-2xl font-bold text-primary">AI</span>
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  Professional Proposal Editor
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  AI-generated content · Live preview · One-click PDF export
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
