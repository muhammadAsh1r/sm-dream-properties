import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

type AccessDeniedPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

const MESSAGES: Record<string, { title: string; description: string }> = {
  default: {
    title: "Access denied",
    description:
      "Your account is signed in but does not have permission to open the admin dashboard. Ask a super admin to set your role to Admin or Agent in Clerk (Public metadata: { \"role\": \"SUPER_ADMIN\" }).",
  },
  deactivated: {
    title: "Account deactivated",
    description:
      "Your admin account has been deactivated. Contact a super admin to restore access.",
  },
  db: {
    title: "Database unavailable",
    description:
      "The admin dashboard could not connect to the database. Check DATABASE_URL and DIRECT_URL in your Vercel project settings, then redeploy.",
  },
};

export default async function AccessDeniedPage({ searchParams }: AccessDeniedPageProps) {
  const { reason } = await searchParams;
  const copy = MESSAGES[reason ?? "default"] ?? MESSAGES.default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-xl bg-primary/20">
          <ShieldAlert className="size-7 text-primary" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-white">{copy.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{copy.description}</p>
        {reason === "default" && (
          <p className="mt-4 text-xs leading-relaxed text-white/45">
            Clerk public metadata example:{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-primary">
              {`{ "role": "SUPER_ADMIN" }`}
            </code>
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button render={<Link href="/" />}>Back to website</Button>
          <Button render={<Link href="/sign-in" />} variant="outline">
            Sign in with another account
          </Button>
        </div>
      </div>
    </div>
  );
}
