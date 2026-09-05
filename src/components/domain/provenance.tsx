import * as React from "react";
import { PenLine, Sparkles, Tags } from "lucide-react";
import { cn } from "@/lib/cn";
import { PROVENANCE_HINTS, PROVENANCE_LABELS } from "@/lib/taxonomy";
import type { Provenance } from "@/lib/types";

const ICONS: Record<Provenance, React.ReactNode> = {
  declared: <PenLine className="size-3" aria-hidden />,
  canonical: <Tags className="size-3" aria-hidden />,
  inferred: <Sparkles className="size-3" aria-hidden />,
};

const TONES: Record<Provenance, string> = {
  declared: "text-muted",
  canonical: "text-muted",
  inferred: "text-accent",
};

/**
 * Marks where a statement came from.
 *
 * This is the smallest component in the product and one of the most important:
 * it is the only thing preventing a model's guess from looking identical to
 * something a person actually said. Inferred content is the only variant that
 * gets a colour, so a scan of the page shows immediately which parts are
 * Manjaniq's reading rather than the member's own words.
 */
export function ProvenanceMark({
  provenance,
  className,
}: {
  provenance: Provenance;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 text-[0.6875rem]", TONES[provenance], className)}
      title={PROVENANCE_HINTS[provenance]}
    >
      {ICONS[provenance]}
      <span>{PROVENANCE_LABELS[provenance]}</span>
    </span>
  );
}

/**
 * Wraps inferred prose so it reads as a reading, not a fact. Declared content
 * is rendered plainly — it needs no framing because the member wrote it.
 */
export function InferredNote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "t-small rounded-md border-s-2 border-accent-border bg-accent-subtle/60 px-3 py-2 text-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}
