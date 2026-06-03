"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User, UserRole } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toggleUserActive, updateUserRole } from "@/features/admin/actions/users-settings";
import { ROLE_HIERARCHY, ROLE_LABELS } from "@/lib/auth/permissions";

const ALL_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "AGENT", "CLIENT"];

type UserTableProps = {
  users: User[];
  actorRole: UserRole;
  actorId: string;
};

function assignableRoles(actorRole: UserRole): UserRole[] {
  return ALL_ROLES.filter((r) => ROLE_HIERARCHY[r] <= ROLE_HIERARCHY[actorRole]);
}

export function UserTable({ users, actorRole, actorId }: UserTableProps) {
  const router = useRouter();
  const roles = assignableRoles(actorRole);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateUserRole(id, role);
      toast.success("Role updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleUserActive(id);
      toast.success("User status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update user");
    }
  };

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const isSelf = user.id === actorId;
              const canEditRole =
                !isSelf && ROLE_HIERARCHY[user.role] <= ROLE_HIERARCHY[actorRole];

              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    {canEditRole ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        aria-label={`Role for ${user.email}`}
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Badge variant="outline">{ROLE_LABELS[user.role]}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "forSale" : "secondary"}>
                      {user.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(user.createdAt, "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => handleToggleActive(user.id)}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {user.active ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
