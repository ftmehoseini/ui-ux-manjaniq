/**
 * Analytics abstraction.
 *
 * No vendor is bundled. The events that matter are defined here as a closed
 * union so call sites are typed and greppable; a real destination is attached
 * at runtime by assigning `window.eventAnalytics`. Until something is attached,
 * events are dropped in production and logged in development. Adding a vendor
 * later means writing one sink, not editing every component.
 */

export type AnalyticsEvent =
  | { name: "registration_started"; eventSlug: string }
  | { name: "registration_completed"; eventSlug: string };

export interface AnalyticsSink {
  track(event: AnalyticsEvent): void;
}

declare global {
  // eslint-disable-next-line no-var
  var eventAnalytics: AnalyticsSink | undefined;
}

/** Records an event. Safe on the server (a no-op) and never throws. */
export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const sink = window.eventAnalytics;
  if (sink) {
    try {
      sink.track(event);
    } catch {
      /* Analytics must never break an interaction. */
    }
    return;
  }
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event.name, event);
  }
}
