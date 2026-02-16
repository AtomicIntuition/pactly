import Link from "next/link";
import { Diamond } from "lucide-react";

export function MarketingFooter(): React.ReactElement {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Diamond className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Pactly</span>
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Product
            </Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              Sign Up
            </Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">
          Built with <Diamond className="inline h-3 w-3" /> by Pactly
        </div>
      </div>
    </footer>
  );
}
