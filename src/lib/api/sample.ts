import { ApiRequestError, type EventApi } from "./client";
import type {
  EventDetail,
  EventRegistrationReceipt,
  EventRegistrationRequest,
} from "@/lib/types";

/**
 * Development data source.
 *
 * It exists so the interface can be built and reviewed without a backend, and
 * it is never the default in production: `getApi()` selects it only when the
 * app is explicitly configured for sample data, and the stage renders a visible
 * marker whenever it is active, so a sample screen cannot be mistaken for a
 * real registration.
 */
const DAY = 86_400_000;
const at = (offsetDays: number, hour: number, minute = 0): string => {
  const date = new Date(Date.now() + offsetDays * DAY);
  // Tehran is UTC+3:30; the sample times are venue-local by construction.
  date.setUTCHours(hour - 3, minute - 30, 0, 0);
  return date.toISOString();
};

const SAMPLE_EVENT: EventDetail = {
  id: "e1",
  slug: "telsi-talk",
  title: "تلسی تاک",
  edition: "۲۲",
  tagline: "یک صبح گفت‌وگو دربارهٔ علم و آینده.",
  startsAt: at(21, 10),
  endsAt: at(21, 14),
  city: "تهران",
  venue: "پردیس سینمایی رزمال",
  state: "open",
  capacity: 300,
  priceIrr: 750_000,
  registrationUrl: null,
  /** Doors 45 minutes before the programme, so it starts on time. */
  arrivalDeadline: at(21, 9, 15),
};

export function createSampleApi(): EventApi {
  return {
    kind: "sample",
    getEvent: async (slug: string) => (slug === SAMPLE_EVENT.slug ? SAMPLE_EVENT : null),
    /**
     * Writes nowhere and confirms every request against the one sample event.
     * The latency exists so the panel's loading state is exercisable offline.
     */
    registerForEvent: async (input: EventRegistrationRequest): Promise<EventRegistrationReceipt> => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      if (input.eventSlug !== SAMPLE_EVENT.slug) throw new ApiRequestError(404, "/events");
      return {
        id: `sample-${Date.now()}`,
        eventSlug: input.eventSlug,
        fullName: input.fullName,
        ticketQuantity: input.quantity,
        status: "confirmed",
        registeredAt: new Date().toISOString(),
        ...(SAMPLE_EVENT.arrivalDeadline ? { arrivalDeadline: SAMPLE_EVENT.arrivalDeadline } : {}),
      };
    },
  };
}

/** The slug the sample data answers to, used by the root route's default. */
export const SAMPLE_EVENT_SLUG = SAMPLE_EVENT.slug;
