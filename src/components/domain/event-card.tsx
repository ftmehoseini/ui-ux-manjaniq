import * as React from "react";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { faDateRange, faDigits } from "@/lib/format";
import type { EventState, EventSummary } from "@/lib/types";
import { Badge, Card, type BadgeTone } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";

const STATE_LABELS: Record<EventState, string> = {
  announced: "به‌زودی",
  open: "ثبت‌نام باز",
  sold_out: "ظرفیت تکمیل",
  live: "در حال برگزاری",
  past: "برگزار شده",
};

const STATE_TONES: Record<EventState, BadgeTone> = {
  announced: "neutral",
  open: "success",
  sold_out: "warning",
  live: "brand",
  past: "neutral",
};

export function EventCard({
  event,
  className,
}: {
  event: EventSummary;
  className?: string;
}) {
  return (
    <Card interactive padding="lg" className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="t-h3 text-ink">{event.title}</h3>
          <p className="t-small mt-1 text-muted">{event.tagline}</p>
        </div>
        <Badge tone={STATE_TONES[event.state]}>{STATE_LABELS[event.state]}</Badge>
      </div>

      <dl className="flex flex-col gap-2">
        <Row icon={<CalendarDays className="size-4" aria-hidden />} label="زمان">
          {faDateRange(event.startsAt, event.endsAt)}
        </Row>
        <Row icon={<MapPin className="size-4" aria-hidden />} label="مکان">
          {event.city} — {event.venue}
        </Row>
        <Row icon={<Users className="size-4" aria-hidden />} label="ظرفیت">
          {faDigits(event.capacity)} شرکت‌کنندهٔ انتخاب‌شده
        </Row>
      </dl>

      <ButtonLink
        href={`/events/${event.slug}`}
        variant={event.state === "open" ? "primary" : "secondary"}
        block
        className="mt-1"
      >
        {event.state === "open" ? "مشاهده رویداد" : "جزئیات رویداد"}
      </ButtonLink>
    </Card>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-faint">{icon}</span>
      <dt className="sr-only">{label}</dt>
      <dd className="t-small text-muted">{children}</dd>
    </div>
  );
}
