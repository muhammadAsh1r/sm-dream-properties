"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  FileText,
  History,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Star,
  UserCircle,
  Users,
} from "lucide-react";
import type { User } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { hasPermission, type Permission } from "@/lib/auth/permissions";

type Command = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string;
  permission?: Permission;
};

const COMMANDS: Command[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, keywords: "home overview", permission: "dashboard:view" },
  { label: "Properties", href: "/admin/properties", icon: Building2, keywords: "listings real estate", permission: "properties:view" },
  { label: "New Property", href: "/admin/properties/new", icon: Building2, keywords: "create add listing", permission: "properties:create" },
  { label: "Leads", href: "/admin/leads", icon: Users, keywords: "contacts sales", permission: "leads:view" },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare, keywords: "messages contact", permission: "inquiries:view" },
  { label: "Blog", href: "/admin/blog", icon: FileText, keywords: "posts cms content", permission: "blog:view" },
  { label: "New Blog Post", href: "/admin/blog/new", icon: FileText, keywords: "create write", permission: "blog:create" },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star, keywords: "reviews ratings", permission: "testimonials:view" },
  { label: "Activity Log", href: "/admin/activity", icon: History, keywords: "audit trail actions", permission: "activity:view" },
  { label: "Users", href: "/admin/users", icon: UserCircle, keywords: "team agents roles", permission: "users:view" },
  { label: "Settings", href: "/admin/settings", icon: Settings, keywords: "company config", permission: "settings:view" },
];

type CommandPaletteProps = {
  user: User;
};

export function CommandPalette({ user }: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  const allowed = COMMANDS.filter((cmd) => {
    if (!cmd.permission) return true;
    if (cmd.permission === "leads:view") {
      return hasPermission(user.role, "leads:view") || hasPermission(user.role, "leads:view_own");
    }
    return hasPermission(user.role, cmd.permission);
  });

  const filtered = allowed.filter((cmd) => {
    const haystack = `${cmd.label} ${cmd.keywords}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Open command palette"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="ml-1 hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border px-4 py-3">
            <DialogTitle className="sr-only">Command palette</DialogTitle>
            <Input
              placeholder="Search pages and actions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0"
              autoFocus
            />
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                No results found
              </p>
            ) : (
              filtered.map((cmd) => (
                <button
                  key={cmd.href}
                  type="button"
                  onClick={() => navigate(cmd.href)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
                  )}
                >
                  <cmd.icon className="size-4 text-muted-foreground" />
                  {cmd.label}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
