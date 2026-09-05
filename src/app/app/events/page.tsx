import * as React from "react";
import Link from "next/link";
import { CalendarDays, Check, Circle, Lock } from "lucide-react";
import { getApi } from "@/lib/api";
import { faDateRange } from "@/lib/format";
import type { EventReadiness } from "@/lib/types";
import { AppPage, PageHeader } from "@/components/layout/page-header";
import { Badge, Card } from "@/components/ui/primitives";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "رویدادها" };

/**
 * The member's own view of the next event: are they ready for it?
 *
 * Round and table assignments are deliberately not shown until the organiser
 * publishes them. Revealing a provisional seating plan early would both leak
 * who is in the room and set expectations the final arrangement may not meet.
 */
export default async function AppEventsPage() {
  let readiness: EventReadiness | null = null;
  let failed = false;

  try {
    readiness = await getApi().getEventReadiness();
  } catch {
    failed = true;
  }

  if (failed) {
    return (
      <AppPage>
        <PageHeader title="رویدادها" />
        <ErrorState className="mt-8" description="اطلاعات رویداد بارگذاری نشد." />
      </AppPage>
    );
  }

  if (!readiness) {
    return (
      <AppPage>
        <PageHeader title="رویدادها" />
        <EmptyState
          className="mt-8"
          icon={<CalendarDays className="size-8" aria-hidden />}
          title="رویداد پیش رویی نداری"
          description="وقتی رویداد تازه‌ای اعلام شود، اینجا می‌بینی. تا آن موقع پیشنهادها بدون رویداد هم برایت ساخته می‌شوند."
          action={<ButtonLink href="/events">رویدادهای عمومی</ButtonLink>}
        />
      </AppPage>
    );
  }

  const { event, checklist } = readiness;
  const remaining = checklist.filter((item) => !item.done);

  return (
    <AppPage>
      <PageHeader title="رویداد پیش رو" description="آماده بودن پروفایلت، کیفیت میزهایت را تعیین می‌کند." />

      <div className="mt-8 flex flex-col gap-6">
        <Card padding="lg">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="t-h2 text-ink">{event.title}</h2>
              <p className="t-small mt-2 text-muted">{faDateRange(event.startsAt, event.endsAt)}</p>
              <p className="t-small text-muted">
                {event.city} — {event.venue}
              </p>
            </div>
            <Badge tone={readiness.registered ? "success" : "warning"}>
              {readiness.registered ? "ثبت‌نام شده" : "هنوز ثبت‌نام نکرده‌ای"}
            </Badge>
          </div>

          <div className="mt-5">
            <ButtonLink href={`/events/${event.slug}`} variant="secondary">
              جزئیات رویداد
            </ButtonLink>
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="t-h3 text-ink">آمادگی برای رویداد</h2>
          <p className="t-small mt-1.5 text-muted">
            {remaining.length === 0
              ? "همه چیز آماده است. چیدمان میزها از روی همین اطلاعات انجام می‌شود."
              : "چیدمان میزها از روی نیازها و توانمندی‌های ثبت‌شده انجام می‌شود؛ موارد باقی‌مانده را کامل کن."}
          </p>

          <ul className="mt-4 flex flex-col gap-2">
            {checklist.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg border border-line p-3 transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  {item.done ? (
                    <Check className="size-4 shrink-0 text-success" aria-hidden />
                  ) : (
                    <Circle className="size-4 shrink-0 text-faint" aria-hidden />
                  )}
                  <span className={item.done ? "t-small text-muted line-through" : "t-small text-ink"}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="lg">
          <h2 className="t-h3 flex items-center gap-2 text-ink">
            <Lock className="size-4 text-faint" aria-hidden />
            میزها و دورهای گفت‌وگو
          </h2>
          <p className="t-small mt-2 text-muted">
            {readiness.roundsPublished
              ? "چیدمان دورها منتشر شده است."
              : "چیدمان دورها نزدیک به زمان رویداد منتشر می‌شود. تا آن موقع نه تو و نه بقیه نمی‌بینید چه کسی سر کدام میز است."}
          </p>
        </Card>
      </div>
    </AppPage>
  );
}
