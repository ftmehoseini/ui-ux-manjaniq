import * as React from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

export interface EventInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}

/** One fact about the event: an icon, what it is, and its value. */
export function EventInfoItem({ icon, label, value, className }: EventInfoItemProps) {
  return (
    <div className={cn("flex flex-1 items-center gap-3 px-4 py-3.5 sm:px-6", className)}>
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-[var(--ev-on-dark)]"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[0.8125rem] leading-6 text-[var(--ev-on-dark-muted)]">{label}</dt>
        <dd className="text-[0.9375rem] font-semibold leading-6 text-[var(--ev-on-dark)]">
          {value}
        </dd>
      </div>
    </div>
  );
}

/**
 * The standing details of the event, under the card.
 *
 * One row with hairline separators on desktop; a stack on mobile, where three
 * columns would shrink each value to two words a line. Separators use logical
 * `border-s` so they land on the correct side under `dir="rtl"`. Every value is
 * data.
 */
export function EventInfoBar({
  dateLabel,
  venueLabel,
  startTimeLabel,
  className,
}: {
  dateLabel: string;
  venueLabel: string;
  startTimeLabel: string;
  className?: string;
}) {
  const items: readonly EventInfoItemProps[] = [
    {
      icon: <CalendarDays className="size-5" aria-hidden />,
      label: "تاریخ برگزاری",
      value: dateLabel,
    },
    { icon: <MapPin className="size-5" aria-hidden />, label: "محل برگزاری", value: venueLabel },
    {
      icon: <Clock className="size-5" aria-hidden />,
      label: "ساعت شروع برنامه",
      value: startTimeLabel,
    },
  ];

  return (
    <dl
      className={cn(
        "ev-glass flex w-full flex-col overflow-hidden rounded-[1.25rem] sm:flex-row sm:items-stretch",
        className,
      )}
    >
      {items.map((item, index) => (
        <EventInfoItem
          key={item.label}
          {...item}
          className={cn(
            index > 0 && "border-t border-white/12 sm:border-t-0 sm:border-s sm:border-white/12",
          )}
        />
      ))}
    </dl>
  );
}
