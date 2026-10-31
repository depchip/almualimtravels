import type { BlogPost } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

const styles = {
  draft: "bg-slate-100 text-slate-600",
  published: "bg-emerald-50 text-emerald-700",
  scheduled: "bg-amber-50 text-amber-700",
} as const;

// A scheduled post whose time has passed is already live on the site, so it shows as published.
export function effectiveStatus(status: BlogPost["status"], publishedAt: BlogPost["publishedAt"]) {
  if (status === "scheduled" && publishedAt && publishedAt.toMillis() <= Date.now()) return "published";
  return status;
}

export function StatusBadge({ status, publishedAt = null }: { status: BlogPost["status"]; publishedAt?: BlogPost["publishedAt"] }) {
  const shown = effectiveStatus(status, publishedAt);

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize", styles[shown])}>{shown}</span>
  );
}

export function formatPostDate(timestamp: BlogPost["updatedAt"], withTime = false) {
  if (!timestamp) return "—";
  return timestamp.toDate().toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}
