import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { faDateRange, faDigits } from "@/lib/format";
import type { EventSummary } from "@/lib/types";
import { PhotoFrame } from "./shell";
import { ButtonLink } from "@/components/ui/button";

/**
 * The upcoming event, given proper editorial weight on the homepage.
 *
 * Wide and asymmetric rather than a small card in a grid — this is the one
 * commercial moment on the page and the layout should say so, without the page
 * turning into a ticket listing.
 */
export function EventFeature({ event }: { event: EventSummary }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <PhotoFrame
        className="lg:col-span-5"
        ratio="4 / 3"
        placeholder="جای عکس واقعی از دورهٔ قبلی رویداد"
      />

      <div className="lg:col-span-7 lg:pt-2">
        <h3 className="t-h1 text-ink">{event.title}</h3>
        <p className="t-lead mt-4 max-w-xl text-muted">{event.tagline}</p>

        <dl className="mt-8">
          <Row label="زمان">{faDateRange(event.startsAt, event.endsAt)}</Row>
          <Row label="مکان">
            {event.city} — {event.venue}
          </Row>
          <Row label="ظرفیت">{faDigits(event.capacity)} شرکت‌کنندهٔ انتخاب‌شده</Row>
        </dl>

        <ButtonLink href={`/events/${event.slug}`} size="lg" className="mt-8">
          مشاهده رویداد
          <ArrowLeft className="size-4" aria-hidden />
        </ButtonLink>
      </div>
    </div>
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
