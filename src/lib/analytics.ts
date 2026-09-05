/**
 * Analytics abstraction.
 *
 * No vendor is bundled. The product's important UX events are defined here as
 * a closed union so that call sites are typed and greppable; a real
 * destination is attached at runtime by assigning `window.manjaniqAnalytics`.
 * Until something is attached, events are dropped in production and logged in
 * development. Adding a vendor later means writing one sink, not editing every
 * component.
 */

export type AnalyticsEvent =
  | { name: "profile_started" }
  | { name: "profile_completed"; readiness: number }
  | { name: "onboarding_step_completed"; step: string }
  | { name: "need_added"; kind: string }
  | { name: "strength_added"; conceptId?: string }
  | { name: "match_viewed"; matchId: string }
  | { name: "match_explanation_opened"; matchId: string; surface: "card" | "detail" }
  | { name: "introduction_requested"; matchId: string }
  | { name: "opportunity_viewed"; opportunityId: string }
  | { name: "event_viewed"; eventSlug: string }
  | { name: "registration_started"; eventSlug: string }
  | { name: "registration_completed"; eventSlug: string }
  | { name: "followup_recorded"; connectionId: string; outcome: string }
  | { name: "next_meeting_recorded"; connectionId: string };

export interface AnalyticsSink {
  track(event: AnalyticsEvent): void;
}

declare global {
  // eslint-disable-next-line no-var
  var manjaniqAnalytics: AnalyticsSink | undefined;
}

/**
 * Records a product event. Safe to call during render-adjacent handlers and on
 * the server (where it is a no-op) — it never throws.
 */
export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const sink = window.manjaniqAnalytics;
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
