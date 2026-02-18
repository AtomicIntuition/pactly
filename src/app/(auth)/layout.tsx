import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background via-background to-secondary px-4 py-8">
      <Link href="/" className="mb-8 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Logo size="lg" />
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
