import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * The event masthead. Both halves come from event data — nothing here knows
 * what «تلسی تاک» or «۲۲» is.
 *
 * Two variants, because the reference uses the masthead in two places:
 *
 * `card`  — centred inside the white panel, with a hairline rule and a line of
 *           instruction under it. This is the heading of the form.
 * `stage` — small, set in the corner of the dark ground above the banner, with
 *           a short gold rule. It appears on the confirmation, where the card's
 *           own heading has become the member's name and something still has to
 *           say which event was just registered for.
 */
export function EventHeader({
  title,
  edition,
  subtitle,
  variant = "card",
  as: Heading = "h1",
  className,
}: {
  title: string;
  edition?: string;
  /** Only rendered by the `card` variant. */
  subtitle?: string;
  variant?: "card" | "stage";
  /** Heading level for the `card` variant; `stage` is never a heading. */
  as?: "h1" | "h2";
  className?: string;
}) {
  if (variant === "stage") {
    return (
      /* Deliberately not a heading: the confirmation's own <h1> is the member's
         name, and a second h1 would compete with it. */
      <div className={cn("flex flex-col items-start", className)}>
        <p className="font-[family-name:var(--font-display)] text-[1.375rem] font-extrabold leading-tight text-[var(--ev-on-dark)] sm:text-[1.625rem]">
          {title}
          {edition && <span className="text-[var(--ev-gold)]"> {edition}</span>}
        </p>
        <span aria-hidden className="mt-2 block h-[3px] w-10 rounded-full bg-[var(--ev-gold)]" />
      </div>
    );
  }

  return (
    <header className={cn("flex flex-col items-center text-center", className)}>
      <Heading className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,1.25rem+2.4vw,2.75rem)] font-extrabold leading-tight text-[var(--ev-ink)]">
        {title}
        {edition && <span className="text-[var(--ev-gold-ink)]"> {edition}</span>}
      </Heading>

      <span aria-hidden className="mt-4 block h-px w-14 bg-[var(--ev-line)]" />

      {subtitle && (
        <p className="mt-4 text-[1.0625rem] leading-8 text-[var(--ev-muted)]">{subtitle}</p>
      )}
    </header>
  );
}
