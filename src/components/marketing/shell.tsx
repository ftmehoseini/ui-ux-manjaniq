import * as React from "react";
import { cn } from "@/lib/cn";

/** Page-width container. One value, used everywhere, so gutters never drift. */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

export interface SectionProps {
  id?: string;
  /** `muted` and `brand` alternate the background to separate the argument's beats. */
  tone?: "default" | "muted" | "brand";
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
}

export function Section({ id, tone = "default", className, children, labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "py-16 sm:py-20",
        tone === "muted" && "bg-surface-muted/50",
        tone === "brand" && "bg-brand text-on-brand",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Numbered step used by the "how it works" narratives. */
export function Step({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-subtle text-sm font-semibold text-brand"
      >
        {index}
      </span>
      <div className="min-w-0 pt-1">
        <h3 className="t-h3 text-ink">{title}</h3>
        <p className="t-body mt-1.5 text-muted">{children}</p>
      </div>
    </li>
  );
}
