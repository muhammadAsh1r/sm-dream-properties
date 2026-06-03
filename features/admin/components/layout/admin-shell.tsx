"use client";

import type { User } from "@prisma/client";

import { Toaster } from "@/components/ui/sonner";
import { AdminMobileNav, AdminSidebar } from "@/features/admin/components/layout/admin-sidebar";
import { CommandPalette } from "@/features/admin/components/shared/command-palette";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  user: User;
  children: React.ReactNode;
};

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <div className="relative flex min-h-screen bg-[#eef1f4]">
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgb(0 200 255 / 0.12), transparent), radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.04) 1px, transparent 0)",
          backgroundSize: "100% 100%, 20px 20px",
        }}
      />

      <div className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 z-20 w-64">
          <AdminSidebar user={user} />
        </div>
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-background/90 px-4 shadow-sm shadow-black/[0.02] backdrop-blur-xl lg:px-8">
          <AdminMobileNav user={user} />
          <CommandPalette user={user} />
          <div className="flex-1" />
        </header>

        <main className={cn("flex-1 p-4 lg:p-8")}>{children}</main>
      </div>

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
