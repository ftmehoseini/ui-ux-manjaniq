import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getApi } from "@/lib/api";
import type { Match, NextAction, Readiness } from "@/lib/types";
import { AppPage, PageHeader } from "@/components/layout/page-header";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { EmptyState, ErrorState, ReadinessMeter } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { NextActionCard } from "@/components/domain/next-action";
import { MatchCardCompact } from "@/components/domain/match-card";

export const metadata = { title: "خانه" };

/**
 * The dashboard answers one question: what is the most valuable thing to do
 * next?
 *
 * It is a ranked queue, not a grid of statistics. There is no "profile views"
 * tile and no connection counter, because neither moves a member closer to an
 * opportunity — the readiness meter is the only number on the page, and it
 * appears with the specific gaps that would raise it.
 */
export default async function AppHomePage() {
  const api = getApi();

  const [actions, readiness, matches] = await Promise.all([
    api.getNextActions().catch((): null => null),
    api.getReadiness().catch((): null => null),
    api.listMatches().catch((): null => null),
  ]);

  if (actions === null && readiness === null && matches === null) {
    return (
      <AppPage>
        <PageHeader title="خانه" />
        <ErrorState
          className="mt-8"
          description="اطلاعات حساب تو بارگذاری نشد. اگر این صفحه به سرور منجنیق وصل نیست، پس از اتصال دوباره تلاش کن."
        />
      </AppPage>
    );
  }

  const ranked = [...(actions ?? [])].sort((a, b) => a.priority - b.priority);
  const [primary, ...rest] = ranked;
  const newMatches = (matches ?? []).filter((match) => match.status === "new");

  return (
    <AppPage>
      <PageHeader
        title="بعدش چه کار کنیم؟"
        description="مهم‌ترین کاری که الان می‌توانی انجام بدهی، بالای همین صفحه است."
      />

      <div className="mt-8 flex flex-col gap-8">
        <section aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="sr-only">
            کارهای پیش رو
          </h2>

          {ranked.length === 0 ? (
            <EmptyState
              title="فعلاً کاری در انتظار تو نیست"
              description="وقتی پیشنهاد تازه‌ای ساخته شود یا ارتباطی به پیگیری نیاز داشته باشد، همین‌جا می‌بینی."
              action={<ButtonLink href="/app/profile">مرور پروفایل</ButtonLink>}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {primary && <NextActionCard action={primary} primary />}
              {rest.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {rest.map((action: NextAction) => (
                    <li key={action.id}>
                      <NextActionCard action={action} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        {readiness && <ReadinessPanel readiness={readiness} />}

        {newMatches.length > 0 && (
          <section aria-labelledby="new-matches-heading">
            <SectionHeader
              as="h2"
              title="پیشنهادهای تازه"
              description="هر کدام دلیل مشخصی دارد. پیش از گفت‌وگو می‌توانی ببینی چرا."
              action={
                <Link
                  href="/app/matches"
                  className="t-label inline-flex min-h-6 items-center gap-1 rounded text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  همهٔ پیشنهادها
                  <ArrowLeft className="size-4" aria-hidden />
                </Link>
              }
            />
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {newMatches.slice(0, 4).map((match: Match) => (
                <li key={match.id}>
                  <MatchCardCompact match={match} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </AppPage>
  );
}

/**
 * Profile quality with its consequences attached. Each gap says what it costs
 * in match quality, so the member is told why to act rather than nagged with a
 * completion bar.
 */
function ReadinessPanel({ readiness }: { readiness: Readiness }) {
  return (
    <section aria-labelledby="readiness-heading">
      <Card padding="lg">
        <h2 id="readiness-heading" className="t-h3 text-ink">
          کیفیت پروفایل تو
        </h2>

        <ReadinessMeter
          className="mt-4"
          score={readiness.score}
          caption={
            readiness.matchable
              ? "پروفایلت آمادهٔ دریافت پیشنهاد است. موارد زیر دقتش را بیشتر می‌کند."
              : "تا این موارد کامل نشود، نمی‌توانیم پیشنهاد دقیقی برایت بسازیم."
          }
        />

        {readiness.gaps.length > 0 && (
          <ul className="mt-5 flex flex-col gap-2">
            {readiness.gaps.map((gap) => (
              <li key={gap.id}>
                <Link
                  href={gap.href}
                  className="flex items-start justify-between gap-3 rounded-lg border border-line p-3 transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <span className="min-w-0">
                    <span className="t-label block text-ink">{gap.action}</span>
                    <span className="t-caption mt-0.5 block text-muted">{gap.effect}</span>
                  </span>
                  <ArrowLeft className="mt-1 size-4 shrink-0 text-faint" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
