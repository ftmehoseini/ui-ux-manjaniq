"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQ accordion built on native `<details>`.
 *
 * Native disclosure gives keyboard support, screen-reader semantics and
 * in-page find for free; the only JavaScript here is the chevron rotation,
 * and the content stays readable if it never runs.
 */
export function Faq({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="divide-y divide-[color:var(--mj-border)] border-y border-line">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-start",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
              "[&::-webkit-details-marker]:hidden",
            )}
          >
            <h3 className="t-h3 text-ink">{item.question}</h3>
            <ChevronDown
              className="size-5 shrink-0 text-faint transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
              aria-hidden
            />
          </summary>
          <p className="t-body max-w-prose pb-5 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
