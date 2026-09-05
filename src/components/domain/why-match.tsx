import * as React from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { GOAL_LABELS, HORIZON_LABELS } from "@/lib/taxonomy";
import type { Coverage } from "@/lib/types";
import { Badge } from "@/components/ui/primitives";
import { ProvenanceMark } from "./provenance";

/**
 * One direction of the exchange: a need on top, the answering strength below.
 *
 * The vertical arrow is deliberate. A horizontal arrow would have to mirror
 * under RTL and would still read ambiguously in a two-column layout; a
 * downward arrow means the same thing in both directions of text.
 */
function ExchangeLeg({
  needLabel,
  strengthLabel,
  coverage,
  tone,
}: {
  needLabel: string;
  strengthLabel: string;
  coverage: Coverage;
  tone: "you" | "them";
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-3 rounded-lg border p-4",
        tone === "you" ? "border-brand-border bg-brand-subtle/50" : "border-line bg-surface-muted/60",
      )}
    >
      <div className="flex flex-col gap-1.5">
        <span className="t-overline text-muted">{needLabel}</span>
        <p className="t-body font-medium text-ink">{coverage.need.title}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={tone === "you" ? "brand" : "neutral"}>
            {GOAL_LABELS[coverage.need.kind]}
          </Badge>
          <span className="t-caption text-muted">{HORIZON_LABELS[coverage.need.horizon]}</span>
          <ProvenanceMark provenance={coverage.need.provenance} />
        </div>
      </div>

      <ArrowDown className="size-4 shrink-0 text-faint" aria-hidden />

      <div className="flex flex-col gap-1.5">
        <span className="t-overline text-muted">{strengthLabel}</span>
        <p className="t-body font-medium text-ink">{coverage.strength.title}</p>
        {coverage.strength.detail && (
          <p className="t-caption text-muted">{coverage.strength.detail}</p>
        )}
        <ProvenanceMark provenance={coverage.strength.provenance} />
      </div>
    </div>
  );
}

export interface WhyThisMatchProps {
  forYou: Coverage;
  forThem: Coverage;
  /** Set on the detail page, where the rationale sentences are worth the space. */
  showRationale?: boolean;
  className?: string;
}

/**
 * The mutual relevance block — the heart of a Manjaniq match.
 *
 * Both directions are always rendered. A match that only benefits one side is
 * not a match, and the layout makes a one-sided relationship visibly
 * lopsided rather than hiding it behind a score.
 */
export function WhyThisMatch({ forYou, forThem, showRationale = false, className }: WhyThisMatchProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ExchangeLeg
          tone="you"
          needLabel="تو دنبال این هستی"
          strengthLabel="او می‌تواند اینجا کمک کند"
          coverage={forYou}
        />
        <ExchangeLeg
          tone="them"
          needLabel="او دنبال این است"
          strengthLabel="تو می‌توانی اینجا کمک کنی"
          coverage={forThem}
        />
      </div>

      {showRationale && (
        <div className="flex flex-col gap-2">
          <RationaleLine coverage={forYou} />
          <RationaleLine coverage={forThem} />
        </div>
      )}
    </div>
  );
}

function RationaleLine({ coverage }: { coverage: Coverage }) {
  return (
    <p className="t-small flex flex-wrap items-baseline gap-x-2 text-muted">
      <span>{coverage.rationale.value}</span>
      <ProvenanceMark provenance={coverage.rationale.provenance} />
    </p>
  );
}
