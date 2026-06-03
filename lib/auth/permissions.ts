import type { UserRole } from "@prisma/client";

export type AdminRole = Extract<UserRole, "SUPER_ADMIN" | "ADMIN" | "AGENT">;

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  AGENT: 50,
  CLIENT: 0,
};

export type Permission =
  | "dashboard:view"
  | "properties:view"
  | "properties:create"
  | "properties:edit"
  | "properties:delete"
  | "properties:feature"
  | "leads:view"
  | "leads:edit"
  | "leads:view_own"
  | "inquiries:view"
  | "inquiries:edit"
  | "blog:view"
  | "blog:create"
  | "blog:edit"
  | "blog:delete"
  | "testimonials:view"
  | "testimonials:edit"
  | "users:view"
  | "users:edit"
  | "settings:view"
  | "settings:edit"
  | "activity:view";

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  SUPER_ADMIN: [
    "dashboard:view",
    "properties:view",
    "properties:create",
    "properties:edit",
    "properties:delete",
    "properties:feature",
    "leads:view",
    "leads:edit",
    "inquiries:view",
    "inquiries:edit",
    "blog:view",
    "blog:create",
    "blog:edit",
    "blog:delete",
    "testimonials:view",
    "testimonials:edit",
    "users:view",
    "users:edit",
    "settings:view",
    "settings:edit",
    "activity:view",
  ],
  ADMIN: [
    "dashboard:view",
    "properties:view",
    "properties:create",
    "properties:edit",
    "properties:delete",
    "properties:feature",
    "leads:view",
    "leads:edit",
    "inquiries:view",
    "inquiries:edit",
    "blog:view",
    "blog:create",
    "blog:edit",
    "blog:delete",
    "testimonials:view",
    "testimonials:edit",
    "activity:view",
  ],
  AGENT: [
    "dashboard:view",
    "properties:view",
    "properties:create",
    "properties:edit",
    "leads:view_own",
    "inquiries:view",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (role === "CLIENT") return false;
  return ROLE_PERMISSIONS[role as AdminRole]?.includes(permission) ?? false;
}

export function isAdminRole(role: UserRole): role is AdminRole {
  return role === "SUPER_ADMIN" || role === "ADMIN" || role === "AGENT";
}

export function canAccessAdmin(role: UserRole): boolean {
  return isAdminRole(role);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  AGENT: "Agent",
  CLIENT: "Client",
};
