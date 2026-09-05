import type { Metadata } from "next";
import * as React from "react";
import { getApi } from "@/lib/api";
import { Section } from "@/components/marketing/shell";
import { SectionHeader } from "@/components/ui/primitives";
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
      <Section className="pt-14">
        <div className="max-w-3xl">
          <h1 className="t-display text-ink">رویدادها</h1>
          <p className="t-body-lg mt-5 text-muted">
            هر رویداد منجنیق یک اتاق انتخاب‌شده است. چیدمان میزها از روی نیاز و توانمندی
            ثبت‌شدهٔ شرکت‌کننده‌ها انجام می‌شود، نه به‌صورت تصادفی.
          </p>
        </div>
      </Section>

      <Section tone="muted" labelledBy="upcoming-heading">
        <SectionHeader overline="پیش رو" title="رویدادهای آینده" />
        <div className="mt-8">
          {failed ? (
            <ErrorState description="فهرست رویدادها بارگذاری نشد. چند لحظه بعد دوباره تلاش کن." />
          ) : upcoming.length === 0 ? (
            <EmptyState
              title="فعلاً رویداد بازی نداریم"
              description="رویداد بعدی وقتی اعلام می‌شود که ترکیب شرکت‌کننده‌ها مشخص شده باشد. اگر پروفایلت را بسازی، پیش از عمومی‌شدن خبرت می‌کنیم."
              action={<ButtonLink href="/app/onboarding">ساخت پروفایل</ButtonLink>}
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
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
          <SectionHeader overline="گذشته" title="رویدادهای برگزارشده" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
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
