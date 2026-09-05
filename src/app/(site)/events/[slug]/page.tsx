import type { Metadata } from "next";
import * as React from "react";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, ShieldCheck, Users } from "lucide-react";
import { getApi } from "@/lib/api";
import { faDateRange, faDigits, faPercent, faPrice } from "@/lib/format";
import type { EventDetail } from "@/lib/types";
import { Container, Section } from "@/components/marketing/shell";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { EventRegistrationCta } from "@/components/marketing/event-cta";

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
          price is stated plainly rather than being revealed at checkout. */}
      <Section className="pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div>
            <Badge tone="brand">{event.city}</Badge>
            <h1 className="t-display mt-3 text-ink">{event.title}</h1>
            <p className="t-body-lg mt-4 max-w-prose text-muted">{event.tagline}</p>

            <dl className="mt-8 flex flex-col gap-3">
              <Fact icon={<CalendarDays className="size-4" aria-hidden />} label="زمان">
                {faDateRange(event.startsAt, event.endsAt)}
              </Fact>
              <Fact icon={<MapPin className="size-4" aria-hidden />} label="مکان">
                {event.venue}
              </Fact>
              <Fact icon={<Users className="size-4" aria-hidden />} label="ظرفیت">
                {faDigits(event.capacity)} شرکت‌کنندهٔ انتخاب‌شده
              </Fact>
            </dl>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <EventRegistrationCta
              slug={event.slug}
              state={event.state}
              priceLabel={event.priceIrr === null ? null : faPrice(event.priceIrr)}
              registrationUrl={event.registrationUrl}
            />
          </div>
        </div>
      </Section>

      <Section tone="muted" labelledBy="about-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="about-heading" className="t-h1 text-ink">
              این رویداد چطور می‌گذرد
            </h2>
            <p className="t-body-lg mt-4 text-muted">{event.about}</p>
          </div>
          <ul className="flex flex-col gap-3">
            {event.format.map((item) => (
              <li key={item.title}>
                <Card>
                  <h3 className="t-h3 text-ink">{item.title}</h3>
                  <p className="t-small mt-1 text-muted">{item.detail}</p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Participant quality, shown as aggregate composition. Never a named
          list — that would expose profiles the members did not make public. */}
      <Section labelledBy="composition-heading">
        <SectionHeader
          overline="ترکیب اتاق"
          title="چه کسانی در این رویداد هستند"
          description="ترکیب کلی شرکت‌کننده‌ها را منتشر می‌کنیم، نه فهرست اسامی. پروفایل هیچ عضوی بدون اجازهٔ خودش نمایش داده نمی‌شود."
        />
        <ul className="mt-8 flex flex-col gap-4">
          {event.composition.map((slice) => (
            <li key={slice.label} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="t-small text-ink">{slice.label}</span>
                <span className="t-small font-semibold text-muted">{faPercent(slice.share)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                <div className="h-full rounded-full bg-brand" style={{ inlineSize: `${slice.share}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted" labelledBy="selection-heading">
        <SectionHeader
          overline="انتخاب"
          title="چطور انتخاب می‌کنیم چه کسی بیاید"
          description="ثبت‌نام به‌تنهایی به معنی حضور نیست. هر درخواست پیش از تأیید بررسی می‌شود."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {event.selection.map((criterion) => (
            <li key={criterion.title}>
              <Card className="h-full">
                <ShieldCheck className="size-5 text-brand" aria-hidden />
                <h3 className="t-h3 mt-3 text-ink">{criterion.title}</h3>
                <p className="t-small mt-1.5 text-muted">{criterion.detail}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="agenda-heading">
        <SectionHeader overline="برنامه" title="برنامهٔ روز رویداد" />
        <ol className="mt-8 max-w-2xl">
          {event.agenda.map((item) => (
            <li key={`${item.time}-${item.title}`} className="flex gap-4 border-b border-line py-4 last:border-0">
              <span className="t-label w-16 shrink-0 text-muted">{item.time}</span>
              <div className="min-w-0">
                <h3 className="t-label text-ink">{item.title}</h3>
                {item.detail && <p className="t-caption mt-0.5 text-muted">{item.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <section className="bg-brand py-14 text-on-brand">
        <Container>
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="t-h2">پیش از ثبت‌نام، پروفایلت را بساز</h2>
              <p className="t-body mt-2 opacity-90">
                چیدمان میزها از روی نیازهای ثبت‌شده انجام می‌شود؛ پروفایل ناقص یعنی میز نامناسب.
              </p>
            </div>
            <ButtonLink
              href="/app/onboarding"
              size="lg"
              variant="inverse"
              className="shrink-0"
            >
              ساخت پروفایل
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

function Fact({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 shrink-0 text-faint">{icon}</span>
      <div>
        <dt className="t-caption text-faint">{label}</dt>
        <dd className="t-body text-ink">{children}</dd>
      </div>
    </div>
  );
}
