import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CircleAlert, MessageCircle, Users } from "lucide-react";
import { getApi } from "@/lib/api";
import { faRelative } from "@/lib/format";
import type { Match } from "@/lib/types";
import { AppPage } from "@/components/layout/page-header";
import { Badge, Card, Tag } from "@/components/ui/primitives";
import { PersonHeader } from "@/components/domain/person";
import { WhyThisMatch } from "@/components/domain/why-match";
import { ProvenanceMark } from "@/components/domain/provenance";
import { MatchDetailActions } from "@/components/domain/match-detail-actions";
import { MatchRelevancePanel } from "@/components/domain/match-relevance-panel";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "جزئیات پیشنهاد" };

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params;

  let match: Match | null = null;
  try {
    match = await getApi().getMatch(id);
  } catch {
    match = null;
  }
  if (!match) notFound();

  return (
    <AppPage>
      <Link
        href="/app/matches"
        className="t-label inline-flex min-h-11 items-center gap-1.5 rounded text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <ArrowRight className="size-4" aria-hidden />
        بازگشت به پیشنهادها
      </Link>

      {/* An intelligence brief, not a social profile: who they are, what the
          opportunity is, why the two of you, what supports it, what is
          uncertain, and only then the action. */}
      <article className="mt-6 flex flex-col gap-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <PersonHeader person={match.person} size="lg" as="h1" className="min-w-0 flex-1" />
          <div className="flex flex-col items-end gap-1.5">
            {match.status === "new" && <Badge tone="brand">تازه</Badge>}
            <span className="t-caption text-faint">{faRelative(match.createdAt)}</span>
          </div>
        </header>

        {match.context && (
          <p className="t-small inline-flex items-center gap-2 text-muted">
            <Users className="size-4 text-faint" aria-hidden />
            زمینهٔ این پیشنهاد: {match.context}
          </p>
        )}

        <Card padding="lg">
          <h2 className="t-h3 text-ink">چرا این پیشنهاد؟</h2>
          <p className="t-small mt-1.5 text-muted">
            پیشنهاد وقتی ساخته می‌شود که هر دو ستون پر باشد.
          </p>
          <WhyThisMatch className="mt-4" forYou={match.forYou} forThem={match.forThem} showRationale />
        </Card>

        {match.reasons.length > 0 && (
          <Card padding="lg">
            <h2 className="t-h3 text-ink">چه چیزهایی این پیشنهاد را پشتیبانی می‌کند</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {match.reasons.map((reason) => (
                <li key={reason.label} className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="t-label text-ink">{reason.label}</span>
                    <ProvenanceMark provenance={reason.provenance} />
                  </div>
                  {reason.detail && <p className="t-small text-muted">{reason.detail}</p>}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <MatchRelevancePanel matchId={match.id} relevance={match.relevance} />

        {match.sharedContext.length > 0 && (
          <Card padding="lg">
            <h2 className="t-h3 text-ink">زمینهٔ مشترک</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {match.sharedContext.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {match.conversationStarters.length > 0 && (
          <Card padding="lg">
            <h2 className="t-h3 text-ink">می‌توانی از اینجا شروع کنی</h2>
            <p className="t-small mt-1.5 text-muted">
              این‌ها پیشنهاد ماست، نه متن آماده. با زبان خودت بپرس.
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {match.conversationStarters.map((starter) => (
                <li
                  key={starter.value}
                  className="flex items-start gap-2.5 rounded-lg border border-line bg-surface-muted/50 p-3"
                >
                  <MessageCircle className="mt-1 size-4 shrink-0 text-faint" aria-hidden />
                  <div className="min-w-0">
                    <p className="t-small text-ink">{starter.value}</p>
                    <ProvenanceMark provenance={starter.provenance} className="mt-1" />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Caveats are given their own block rather than a footnote. A member
            deciding whether to spend an introduction deserves to see the
            weaknesses at the same weight as the reasons. */}
        {match.uncertainties.length > 0 && (
          <Card padding="lg" className="border-warning/30 bg-warning-subtle/40">
            <h2 className="t-h3 flex items-center gap-2 text-ink">
              <CircleAlert className="size-5 text-warning" aria-hidden />
              چیزهایی که هنوز روشن نیست
            </h2>
            <ul className="mt-3 flex list-disc flex-col gap-2 ps-5 text-muted marker:text-faint">
              {match.uncertainties.map((note) => (
                <li key={note} className="t-small">
                  {note}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <MatchDetailActions match={match} />
      </article>
    </AppPage>
  );
}
