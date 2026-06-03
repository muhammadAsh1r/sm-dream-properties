"use client";

import { format } from "date-fns";
import type { ActivityLog, User } from "@prisma/client";

type ActivityRow = ActivityLog & {
  user: Pick<User, "name" | "email"> | null;
};

const ACTION_LABELS: Record<string, string> = {
  PROPERTY_CREATED: "Property created",
  PROPERTY_UPDATED: "Property updated",
  PROPERTY_DELETED: "Property deleted",
  PROPERTY_FEATURED: "Property featured",
  PROPERTY_UNFEATURED: "Property unfeatured",
  PROPERTY_ARCHIVED: "Property archived",
  PROPERTY_DUPLICATED: "Property duplicated",
  LEAD_CREATED: "Lead created",
  LEAD_STATUS_UPDATED: "Lead status updated",
  LEAD_UPDATED: "Lead updated",
  INQUIRY_STATUS_UPDATED: "Inquiry status updated",
  BLOG_CREATED: "Blog post created",
  BLOG_UPDATED: "Blog post updated",
  BLOG_PUBLISHED: "Blog post published",
  BLOG_DELETED: "Blog post deleted",
  TESTIMONIAL_CREATED: "Testimonial created",
  TESTIMONIAL_UPDATED: "Testimonial updated",
  TESTIMONIAL_DELETED: "Testimonial deleted",
  USER_ROLE_UPDATED: "User role updated",
  USER_INVITED: "Team member invited",
  USER_ACTIVATED: "User activated",
  USER_DEACTIVATED: "User deactivated",
  SETTINGS_UPDATED: "Settings updated",
  CATEGORY_CREATED: "Category created",
  CATEGORY_DELETED: "Category deleted",
};

export function ActivityLogTable({ logs }: { logs: ActivityRow[] }) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
        No activity recorded yet
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">Action</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Entity</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">User</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">
                  {ACTION_LABELS[log.action] ?? log.action}
                  {log.metadata &&
                    typeof log.metadata === "object" &&
                    "title" in log.metadata && (
                      <span className="ml-1 font-normal text-muted-foreground">
                        — {String((log.metadata as { title: string }).title)}
                      </span>
                    )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {log.entityType}
                  {log.entityId && (
                    <span className="ml-1 text-xs opacity-60">
                      ({log.entityId.slice(0, 8)}…)
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {log.user?.name ?? log.user?.email ?? "System"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {format(log.createdAt, "dd MMM yyyy, HH:mm")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
