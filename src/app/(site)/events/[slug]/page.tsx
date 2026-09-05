import type { Metadata } from "next";
import * as React from "react";
import { notFound } from "next/navigation";
import { getApi } from "@/lib/api";
import { faDateRange, faDigits, faPercent, faPrice } from "@/lib/format";
import type { EventDetail } from "@/lib/types";
import {
  Container,
  EditorialHead,
  PhotoFrame,
  Section,
  TrajectoryArc,
} from "@/components/marketing/shell";
import { EventRegistrationCta } from "@/components/marketing/event-cta";
import { ButtonLink } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadEvent(slug: string): Promise<EventDetail | null> {
  try {
    return await getApi().getEvent(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await loadEvent(slug);
  if (!event) return { title: "رویداد پیدا نشد" };
  return {
    title: event.title,
    description: event.tagline,
    openGraph: { title: event.title, description: event.tagline, type: "article" },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);
  if (!event) notFound();

  return (
    <>
      {/* Trust before commitment: the evidence sits above the purchase, and the
          price is stated plainly rather than revealed at checkout. */}
      <section className="grain relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20">
        <TrajectoryArc className="pointer-events-none absolute -top-4 left-0 h-64 w-[70%] text-brand/12" />
        <Container className="relative">
          <p className="t-overline text-accent">رویداد منجنیق — {event.city}</p>
          <h1 className="t-display mt-5 max-w-4xl text-ink">{event.title}</h1>
          <p className="t-lead mt-6 max-w-2xl text-muted">{event.tagline}</p>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <PhotoFrame ratio="16 / 9" placeholder="جای عکس واقعی از دورهٔ قبلی رویداد" />
              <dl className="mt-8">
                <Row label="زمان">{faDateRange(event.startsAt, event.endsAt)}</Row>
                <Row label="مکان">{event.venue}</Row>
                <Row label="ظرفیت">{faDigits(event.capacity)} شرکت‌کنندهٔ انتخاب‌شده</Row>
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <EventRegistrationCta
                  slug={event.slug}
                  state={event.state}
                  priceLabel={event.priceIrr === null ? null : faPrice(event.priceIrr)}
                  registrationUrl={event.registrationUrl}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="surface" labelledBy="about-heading">
        <EditorialHead
          index={1}
          label="فرمت"
          id="about-heading"
          title="این رویداد چطور می‌گذرد"
          lead={event.about}
        />
        <ol className="mt-12">
          {event.format.map((item, index) => (
            <li key={item.title} className="rule-t grid gap-3 py-7 sm:grid-cols-12 sm:gap-8 last:rule-b">
              <span
                aria-hidden
                className="font-[family-name:var(--font-display)] text-sm font-bold text-accent sm:col-span-1"
              >
                {faDigits(`0${index + 1}`)}
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-ink sm:col-span-4">
                {item.title}
              </h3>
              <p className="t-body-lg text-muted sm:col-span-7">{item.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Participant quality as aggregate composition. Never a named list —
          that would expose profiles the members did not make public. */}
      <Section labelledBy="composition-heading">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="t-overline text-accent">۰۲ — ترکیب اتاق</p>
            <h2 id="composition-heading" className="t-h1 mt-4 text-ink">
              چه کسانی در این رویداد هستند
            </h2>
            <p className="t-body mt-5 text-muted">
              ترکیب کلی شرکت‌کننده‌ها را منتشر می‌کنیم، نه فهرست اسامی. پروفایل هیچ عضوی بدون
              اجازهٔ خودش نمایش داده نمی‌شود.
            </p>
          </div>

          <ul className="lg:col-span-7 lg:pt-10">
            {event.composition.map((slice) => (
              <li key={slice.label} className="rule-t py-5 last:rule-b">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-[family-name:var(--font-display)] text-lg font-bold text-ink">
                    {slice.label}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-lg font-bold text-accent">
                    {faPercent(slice.share)}
                  </span>
                </div>
                <div className="mt-3 h-1 bg-surface-muted">
                  <div className="h-full bg-brand" style={{ inlineSize: `${slice.share}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="deep" labelledBy="selection-heading">
        <EditorialHead
          index={3}
          label="انتخاب"
          id="selection-heading"
          title="چطور انتخاب می‌کنیم چه کسی بیاید"
          lead="ثبت‌نام به‌تنهایی به معنی حضور نیست. هر درخواست پیش از تأیید بررسی می‌شود."
          tone="deep"
        />
        <ul className="mt-12 grid gap-px bg-white/15 sm:grid-cols-3">
          {event.selection.map((criterion, index) => (
            <li key={criterion.title} className="bg-deep p-6">
              <span
                aria-hidden
                className="font-[family-name:var(--font-display)] text-sm font-bold text-accent-on-deep"
              >
                {faDigits(`0${index + 1}`)}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-on-deep">
                {criterion.title}
              </h3>
              <p className="t-small mt-2 text-on-deep-muted">{criterion.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted" labelledBy="agenda-heading">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="t-overline text-accent">۰۴ — برنامه</p>
            <h2 id="agenda-heading" className="t-h1 mt-4 text-ink">
              برنامهٔ روز رویداد
            </h2>
          </div>
          <ol className="lg:col-span-8">
            {event.agenda.map((item) => (
              <li key={`${item.time}-${item.title}`} className="rule-t flex gap-6 py-5 last:rule-b">
                <span className="font-[family-name:var(--font-display)] w-16 shrink-0 text-base font-bold text-accent">
                  {item.time}
                </span>
                <div className="min-w-0">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-ink">
                    {item.title}
                  </h3>
                  {item.detail && <p className="t-small mt-1 text-muted">{item.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="brand" size="tall" className="overflow-hidden">
        <TrajectoryArc className="pointer-events-none absolute inset-x-0 bottom-0 h-48 w-full text-white/10" />
        <div className="relative max-w-2xl">
          <h2 className="t-h1">پیش از ثبت‌نام، پروفایلت را بساز</h2>
          <p className="t-lead mt-5 opacity-90">
            چیدمان میزها از روی نیازهای ثبت‌شده انجام می‌شود؛ پروفایل ناقص یعنی میز نامناسب.
          </p>
          <ButtonLink href="/app/onboarding" size="lg" variant="inverse" className="mt-8">
            ساخت پروفایل
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rule-t grid grid-cols-3 gap-4 py-3.5 last:rule-b sm:grid-cols-4">
      <dt className="t-caption text-faint">{label}</dt>
      <dd className="t-small col-span-2 text-ink sm:col-span-3">{children}</dd>
    </div>
  );
}
