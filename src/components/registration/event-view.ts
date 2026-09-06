import { faEventDate, faEventTime, faPrice } from "@/lib/format";
import type { EventDetail, EventState } from "@/lib/types";

/**
 * What the registration stage needs from an event.
 *
 * Built on the server so every date, time and price on the screen is formatted
 * once, by one `Intl` instance, and the client never re-derives a label. It is
 * also the reason the client bundle does not carry the whole `EventDetail`.
 */
export interface RegistrationEventView {
  readonly slug: string;
  readonly title: string;
  /** Accented half of the masthead — the «۲۲» in «تلسی تاک ۲۲». */
  readonly edition?: string;
  readonly state: EventState;
  readonly bannerUrl?: string;
  /** Photograph behind the whole stage. Absent = the CSS-composed auditorium. */
  readonly backdropUrl?: string;
  readonly priceLabel: string | null;
  readonly dateLabel: string;
  readonly startTimeLabel: string;
  readonly venueLabel: string;
  /** Pre-formatted door time. Absent when the organiser published none. */
  readonly arrivalLabel?: string;
}

export function toRegistrationEvent(event: EventDetail): RegistrationEventView {
  return {
    slug: event.slug,
    title: event.title,
    ...(event.edition ? { edition: event.edition } : {}),
    state: event.state,
    ...(event.bannerUrl ? { bannerUrl: event.bannerUrl } : {}),
    ...(event.coverUrl ? { backdropUrl: event.coverUrl } : {}),
    priceLabel: event.priceIrr === null ? null : faPrice(event.priceIrr),
    dateLabel: faEventDate(event.startsAt),
    startTimeLabel: faEventTime(event.startsAt),
    venueLabel: event.venue,
    ...(event.arrivalDeadline ? { arrivalLabel: faEventTime(event.arrivalDeadline) } : {}),
  };
}
