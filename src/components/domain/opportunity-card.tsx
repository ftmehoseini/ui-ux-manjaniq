"use client";

import * as React from "react";
import { CalendarClock, Target } from "lucide-react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { faRelative } from "@/lib/format";
import { GOAL_LABELS } from "@/lib/taxonomy";
import type { Opportunity } from "@/lib/types";
import { Badge, Card, Tag } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PersonHeader } from "./person";
import { RelevanceDisclosure } from "./relevance";

/**
 * An opportunity: relevance without a person necessarily attached.
 *
 * Deliberately built to sit in the same feed as a `MatchCard` — same width,
 * same reading order, same footer. When opportunity discovery grows beyond
 * person-to-person matching, the two can interleave without a redesign.
 */
export function OpportunityCard({
  opportunity,
  className,
}: {
  opportunity: Opportunity;
  className?: string;
}) {
  return (
    <Card interactive padding="lg" className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent">
            <Target className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="t-h3 text-ink">{opportunity.title}</h3>
            <p className="t-small mt-1 text-muted">{opportunity.summary}</p>
          </div>
        </div>
        <Badge tone="accent">{GOAL_LABELS[opportunity.kind]}</Badge>
      </div>

      {opportunity.matchedNeeds.length > 0 && (
        <div className="rounded-lg border border-brand-border bg-brand-subtle/50 p-3">
          <p className="t-overline mb-1.5 text-muted">به این نیاز تو مربوط است</p>
          <ul className="flex flex-wrap gap-2">
            {opportunity.matchedNeeds.map((need) => (
              <li key={need.id}>
                <Tag className="bg-surface">{need.title}</Tag>
              </li>
            ))}
          </ul>
        </div>
      )}

      {opportunity.source ? (
        <PersonHeader person={opportunity.source} size="sm" />
      ) : (
        <p className="t-caption text-faint">
          هویت ثبت‌کننده تا زمان پذیرش درخواست نمایش داده نمی‌شود.
        </p>
      )}

      <RelevanceDisclosure
        relevance={opportunity.relevance}
        onOpen={() => track({ name: "opportunity_viewed", opportunityId: opportunity.id })}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <span className="t-caption inline-flex items-center gap-1.5 text-muted">
          <CalendarClock className="size-3.5 text-faint" aria-hidden />
          {opportunity.closesAt
            ? `مهلت پاسخ ${faRelative(opportunity.closesAt)}`
            : `ثبت‌شده ${faRelative(opportunity.postedAt)}`}
        </span>
        <Button
          size="md"
          onClick={() => track({ name: "opportunity_viewed", opportunityId: opportunity.id })}
        >
          اعلام آمادگی
        </Button>
      </div>
    </Card>
  );
}
