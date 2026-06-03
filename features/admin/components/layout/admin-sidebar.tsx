"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  History,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  UserCircle,
  Users,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import type { User } from "@prisma/client";

import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { hasPermission, ROLE_LABELS, type Permission } from "@/lib/auth/permissions";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "dashboard:view" },
  { label: "Properties", href: "/admin/properties", icon: Building2, permission: "properties:view" },
  { label: "Leads", href: "/admin/leads", icon: Users, permission: "leads:view" },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare, permission: "inquiries:view" },
  { label: "Blog", href: "/admin/blog", icon: FileText, permission: "blog:view" },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star, permission: "testimonials:view" },
  { label: "Activity", href: "/admin/activity", icon: History, permission: "activity:view" },
  { label: "Users", href: "/admin/users", icon: UserCircle, permission: "users:view" },
  { label: "Settings", href: "/admin/settings", icon: Settings, permission: "settings:view" },
];

type AdminSidebarProps = {
  user: User;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function AdminSidebar({ user, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  const items = navItems.filter((item) => {
    if (!item.permission) return true;
    if (item.permission === "leads:view") {
      return hasPermission(user.role, "leads:view") || hasPermission(user.role, "leads:view_own");
    }
    return hasPermission(user.role, item.permission);
  });

  return (
    <aside className="flex h-full flex-col bg-secondary text-white">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary">
          SM
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-bold">SM Dream</p>
          <p className="truncate text-[0.65rem] uppercase tracking-widest text-white/50">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin navigation">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <UserButton />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name ?? user.email}</p>
            <p className="truncate text-xs text-white/50">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-3 flex items-center gap-2 text-xs text-white/50 transition-colors hover:text-white"
        >
          <ChevronLeft className="size-3" />
          Back to website
        </Link>
      </div>
    </aside>
  );
}

export function AdminMobileNav({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex size-10 items-center justify-center rounded-lg border border-border lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 text-white/70"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            <AdminSidebar user={user} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
