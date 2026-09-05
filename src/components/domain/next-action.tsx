import * as React from "react";
import Link from "next/link";
import {
  CalendarCheck,
  ChevronLeft,
  MessageSquareReply,
  Sparkles,
  Target,
  UserPen,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { faDigits } from "@/lib/format";
import type { ActionKind, NextAction } from "@/lib/types";

const ICONS: Record<ActionKind, React.ReactNode> = {
  review_matches: <Sparkles className="size-5" aria-hidden />,
  complete_profile: <UserPen className="size-5" aria-hidden />,
  event_prep: <CalendarCheck className="size-5" aria-hidden />,
  follow_up: <MessageSquareReply className="size-5" aria-hidden />,
  record_outcome: <MessageSquareReply className="size-5" aria-hidden />,
  review_opportunity: <Target className="size-5" aria-hidden />,
};

/**
 * One item in the dashboard's ranked queue.
 *
 * `primary` is reserved for the single highest-ranked action. Giving every
 * card equal weight would recreate the dashboard-of-widgets this product is
 * trying not to be: the point is that one thing is clearly the next thing.
 */
export function NextActionCard({
  action,
  primary = false,
  className,
}: {
  action: NextAction;
  primary?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={action.href}
      className={cn(
        "group flex items-start gap-4 rounded-xl border p-5 transition-shadow",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        "motion-reduce:transition-none",
        primary
          ? "border-brand-border bg-brand-subtle hover:shadow-md"
          : "border-line bg-surface hover:shadow-md",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-lg",
          primary ? "bg-brand text-on-brand" : "bg-surface-muted text-brand",
        )}
      >
        {ICONS[action.kind]}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className={cn("block text-ink", primary ? "t-h3" : "t-label font-semibold")}>
            {action.title}
          </span>
          {typeof action.count === "number" && action.count > 0 && (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[0.6875rem] leading-5 text-on-brand">
              {faDigits(action.count)}
            </span>
          )}
        </span>
        <span className="t-small mt-1 block text-muted">{action.detail}</span>
        <span className="t-label mt-3 inline-flex items-center gap-1 text-brand">
          {action.ctaLabel}
          <ChevronLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
            aria-hidden
          />
        </span>
      </span>
    </Link>
  );
}
