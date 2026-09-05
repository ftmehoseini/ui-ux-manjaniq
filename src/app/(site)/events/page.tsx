import type { Metadata } from "next";
import * as React from "react";
import { getApi } from "@/lib/api";
import { Container, EditorialHead, Section, TrajectoryArc } from "@/components/marketing/shell";

import { EmptyState, ErrorState } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { EventCard } from "@/components/domain/event-card";
import type { EventSummary } from "@/lib/types";

export const metadata: Metadata = {
  title: "رویدادها",
  description:
    "رویدادهای منجنیق: گفت‌وگوهای حضوری با چیدمان از پیش تعیین‌شده بر اساس نیاز و توانمندی شرکت‌کننده‌ها.",
};

export default async function EventsPage() {
  let events: readonly EventSummary[] | null = null;
  let failed = false;

  try {
    events = await getApi().listEvents();
  } catch {
    failed = true;
  }

  const upcoming = events?.filter((event) => event.state !== "past") ?? [];
  const past = events?.filter((event) => event.state === "past") ?? [];

  return (
    <>
      <section className="grain relative overflow-hidden pt-14 pb-16 sm:pt-20">
        <TrajectoryArc className="pointer-events-none absolute -top-4 left-0 h-64 w-[70%] text-brand/12" />
        <Container className="relative">
          <p className="t-overline text-accent">رویدادها</p>
          <h1 className="t-display mt-5 text-ink">اتاق‌های انتخاب‌شده</h1>
          <p className="t-lead mt-6 max-w-2xl text-muted">
            هر رویداد منجنیق یک اتاق انتخاب‌شده است. چیدمان میزها از روی نیاز و توانمندی
            ثبت‌شدهٔ شرکت‌کننده‌ها انجام می‌شود، نه به‌صورت تصادفی.
          </p>
        </Container>
      </section>

      <Section tone="muted" labelledBy="upcoming-heading">
        <EditorialHead index={1} label="پیش رو" title="رویدادهای آینده" />
        <div className="mt-12">
          {failed ? (
            <ErrorState description="فهرست رویدادها بارگذاری نشد. چند لحظه بعد دوباره تلاش کن." />
          ) : upcoming.length === 0 ? (
            <EmptyState
              title="فعلاً رویداد بازی نداریم"
              description="رویداد بعدی وقتی اعلام می‌شود که ترکیب شرکت‌کننده‌ها مشخص شده باشد. اگر پروفایلت را بسازی، پیش از عمومی‌شدن خبرت می‌کنیم."
              action={<ButtonLink href="/app/onboarding">ساخت پروفایل</ButtonLink>}
            />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2">
              {upcoming.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {past.length > 0 && (
        <Section labelledBy="past-heading">
          <EditorialHead index={2} label="گذشته" title="رویدادهای برگزارشده" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {past.map((event) => (
              <li key={event.id}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
