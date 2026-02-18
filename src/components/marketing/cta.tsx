import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Cta(): React.ReactElement {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Subtle gold gradient bg glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Stop writing proposals. Start closing deals.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Join thousands of freelancers and agencies who are winning more clients with
          AI-powered proposals.
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <Button size="lg" className="text-base px-8 gap-2">
              Start Free — No Card Required
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-primary" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-primary" />
            5 free proposals
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-primary" />
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}
