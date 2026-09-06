import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * The event masthead: title, an accented edition marker, a short brass rule,
 * and one line of instruction. Both halves come from event data — nothing here
 * knows what «تلسی تاک» or «۲۲» is.
 */
export function EventHeader({
  title,
  edition,
  subtitle,
  as: Heading = "h1",
  className,
}: {
  title: string;
  edition?: string;
  subtitle?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
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
