import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Cta(): React.ReactElement {
  return (
    <section className="bg-muted/50 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Ready to close more deals?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Join thousands of freelancers and agencies who are winning more clients with
          AI-powered proposals.
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <Button size="lg" className="text-base px-8">
              Get Started Free
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
    </section>
  );
}
