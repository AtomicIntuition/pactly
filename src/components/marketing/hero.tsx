import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero(): React.ReactElement {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            AI-Powered Proposals{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              That Close Deals
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
            Stop spending hours writing proposals. Paste your client&apos;s brief and get a
            polished, professional proposal in under a minute.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" size="lg" className="text-base">
                See How It Works
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-success" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-success" />
              5 free proposals
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-success" />
              Cancel anytime
            </span>
          </div>
        </div>

        {/* Product screenshot mockup */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-xl border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 border-b px-4 py-3 bg-muted/50">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground">pactly.com/proposals/editor</span>
              </div>
            </div>
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">AI</span>
                </div>
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                  Professional Proposal Editor
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">
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
