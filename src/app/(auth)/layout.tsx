import Link from "next/link";
import { Diamond } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-8">
      <Link href="/" className="mb-8 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Diamond className="h-8 w-8 text-primary" />
        <span className="text-2xl font-semibold tracking-tight">Pactly</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
