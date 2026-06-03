import { formatDistanceToNow } from "date-fns";
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

export function ActivityLogFeed({ logs }: { logs: ActivityRow[] }) {
  if (logs.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No recent activity
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {logs.map((log) => (
        <li key={log.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          <div className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground">
              {ACTION_LABELS[log.action] ?? log.action}
              {log.metadata &&
                typeof log.metadata === "object" &&
                "title" in log.metadata && (
                  <span className="text-muted-foreground">
                    {" "}
                    — {String((log.metadata as { title: string }).title)}
                  </span>
                )}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {log.user?.name ?? log.user?.email ?? "System"} ·{" "}
              {formatDistanceToNow(log.createdAt, { addSuffix: true })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
