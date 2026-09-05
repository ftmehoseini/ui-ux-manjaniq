"use client";

import * as React from "react";
import Link from "next/link";
import { CircleAlert, Handshake } from "lucide-react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { faRelative } from "@/lib/format";
import type { Match } from "@/lib/types";
import { Badge, Card, Tag } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/button";
import { PersonHeader } from "./person";
import { RelevanceDisclosure } from "./relevance";
import { WhyThisMatch } from "./why-match";

export interface MatchCardProps {
  match: Match;
  onRequestIntroduction?: (match: Match) => void;
  className?: string;
}

/**
 * The Manjaniq match card.
 *
 * Reading order is deliberate and is the argument the product makes:
 *
 *   who this is  →  why you two  →  what else supports it  →  what to do next
 *
 * The mutual exchange sits directly under the name, before any score, because
 * "why should I talk to this person?" is the only question the card exists to
 * answer. Caveats are shown on the card rather than buried in the detail page:
 * a member who finds out about a thin profile only after requesting an
 * introduction has been mildly misled by the interface.
 */
export function MatchCard({ match, onRequestIntroduction, className }: MatchCardProps) {
  const requested = match.status === "intro_requested" || match.status === "intro_accepted";

  return (
    <Card
      interactive
      padding="lg"
      className={cn("flex flex-col gap-5", className)}
      aria-labelledby={`match-${match.id}-name`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div id={`match-${match.id}-name`} className="min-w-0 flex-1">
          <PersonHeader person={match.person} as="h2" />
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {match.status === "new" && <Badge tone="brand">تازه</Badge>}
          {requested && <Badge tone="success">درخواست معرفی ثبت شد</Badge>}
          <span className="t-caption text-faint">{faRelative(match.createdAt)}</span>
        </div>
      </div>

      <section aria-label="چرا این پیشنهاد" className="flex flex-col gap-3">
        <h3 className="t-label text-ink">چرا این پیشنهاد؟</h3>
        <WhyThisMatch forYou={match.forYou} forThem={match.forThem} />
      </section>

      {match.reasons.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="دلایل پشتیبان">
          {match.reasons.map((reason) => (
            <li key={reason.label}>
              <Tag title={reason.detail}>{reason.label}</Tag>
            </li>
          ))}
        </ul>
      )}

      <RelevanceDisclosure
        relevance={match.relevance}
        onOpen={() =>
          track({ name: "match_explanation_opened", matchId: match.id, surface: "card" })
        }
      />

      {match.uncertainties.length > 0 && (
        <div className="flex gap-2 text-muted">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
          <ul className="flex flex-col gap-1">
            {match.uncertainties.map((note) => (
              <li key={note} className="t-caption">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <ButtonLink
          href={`/app/matches/${match.id}`}
          variant="secondary"
          size="md"
          className="sm:order-2"
          onClick={() => track({ name: "match_viewed", matchId: match.id })}
        >
          جزئیات پیشنهاد
        </ButtonLink>

        {requested ? (
          <p className="t-small text-muted sm:order-1">
            وقتی طرف مقابل معرفی را بپذیرد، خبرت می‌کنیم.
          </p>
        ) : (
          <Button
            variant="primary"
            size="md"
            className="sm:order-1"
            onClick={() => {
              track({ name: "introduction_requested", matchId: match.id });
              onRequestIntroduction?.(match);
            }}
          >
            <Handshake className="size-4" aria-hidden />
            درخواست معرفی
          </Button>
        )}
      </div>
    </Card>
  );
}

/** Loading placeholder shaped like the real card, to avoid a layout jump. */
export function MatchCardSkeleton() {
  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="size-12 shrink-0 animate-pulse rounded-full bg-surface-muted motion-reduce:animate-none" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/5 animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
          <div className="h-3 w-3/5 animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="h-40 flex-1 animate-pulse rounded-lg bg-surface-muted motion-reduce:animate-none" />
        <div className="h-40 flex-1 animate-pulse rounded-lg bg-surface-muted motion-reduce:animate-none" />
      </div>
      <div className="h-10 w-full animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
    </Card>
  );
}

/** Compact variant for the dashboard rail, where space is the constraint. */
export function MatchCardCompact({ match }: { match: Match }) {
  return (
    <Link
      href={`/app/matches/${match.id}`}
      onClick={() => track({ name: "match_viewed", matchId: match.id })}
      className="block rounded-xl border border-line bg-surface p-4 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
    >
      <PersonHeader person={match.person} size="sm" />
      <p className="t-small mt-3 text-muted">
        <span className="text-ink">{match.forYou.strength.title}</span> — در پاسخ به نیاز تو:{" "}
        {match.forYou.need.title}
      </p>
    </Link>
  );
}
