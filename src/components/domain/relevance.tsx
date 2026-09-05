"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { faPercent } from "@/lib/format";
import type { Relevance } from "@/lib/types";

/**
 * A relevance score with its reasons attached.
 *
 * The number is never the headline and never appears alone: the component
 * takes `Relevance`, whose `basis` is non-optional, and renders the figure as
 * a quiet secondary line under an expandable list of what produced it. When
 * the engine cannot explain a score, callers pass `null` and nothing is shown
 * — an unexplained percentage is worse than no percentage.
 */
export function RelevanceDisclosure({
  relevance,
  onOpen,
  className,
}: {
  relevance: Relevance | null;
  onOpen?: () => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  if (!relevance) return null;

  function toggle() {
    setOpen((current) => {
      if (!current) onOpen?.();
      return !current;
    });
  }

  return (
    <div className={cn("rounded-md bg-surface-muted/70 px-3 py-2", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex min-h-6 w-full items-center justify-between gap-2 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <span className="t-caption text-muted">
          هم‌خوانی این پیشنهاد با نیازهای تو:{" "}
          <span className="font-semibold text-ink">{faPercent(relevance.score)}</span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-faint transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <ul className="mt-2 flex list-disc flex-col gap-1 ps-4 text-muted marker:text-faint">
          {relevance.basis.map((reason) => (
            <li key={reason} className="t-caption">
              {reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
