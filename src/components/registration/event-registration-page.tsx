import * as React from "react";
import { notFound } from "next/navigation";
import { getApi, isSampleData } from "@/lib/api";
import { SAMPLE_EVENT_SLUG } from "@/lib/api/sample";
import type { EventDetail } from "@/lib/types";
import { EventBackground } from "./event-background";
import { EventBanner } from "./event-banner";
import { EventInfoBar } from "./event-info-bar";
import { RegistrationStage } from "./registration-stage";
import { toRegistrationEvent } from "./event-view";

/** Which event the root route registers people for. */
export function defaultEventSlug(): string {
  return process.env.NEXT_PUBLIC_EVENT_SLUG ?? SAMPLE_EVENT_SLUG;
}

/**
 * Reads one event. A failure is not distinguished from an absence on purpose:
 * either way there is no event to register for, and the route renders its
 * not-found rather than a half-populated stage.
 */
export async function loadEvent(slug: string): Promise<EventDetail | null> {
  try {
    return await getApi().getEvent(slug);
  } catch {
    return null;
  }
}

/**
 * The registration stage.
 *
 * A centred column — masthead, banner, card, information bar — over a darkened
 * auditorium. Nothing is absolutely positioned except the background itself, so
 * the whole composition reflows on a phone instead of being scaled down.
 */
export async function EventRegistrationPage({ slug }: { slug: string }) {
  const event = await loadEvent(slug);
  if (!event) notFound();

  const view = toRegistrationEvent(event);

  return (
    <div className="event-stage relative flex min-h-dvh flex-col bg-[var(--ev-ground)]">
      <EventBackground {...(view.backdropUrl ? { imageUrl: view.backdropUrl } : {})} />

      <div className="relative flex flex-1 flex-col items-center px-5 py-6 sm:px-6 sm:py-10">
        <div className="flex w-full max-w-[1100px] flex-1 flex-col items-center gap-6 sm:gap-8">
          <RegistrationStage
            event={view}
            banner={
              <EventBanner
                {...(view.bannerUrl ? { src: view.bannerUrl, alt: `تصویر ${view.title}` } : {})}
                className="max-w-[1000px]"
              />
            }
            topEnd={isSampleData() ? <SampleDataMarker /> : null}
          />

          <EventInfoBar
            dateLabel={view.dateLabel}
            venueLabel={view.venueLabel}
            startTimeLabel={view.startTimeLabel}
            className="max-w-[960px] shrink-0"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Says plainly that the screen is running on placeholder data.
 *
 * Without it a screenshot of the sample event is indistinguishable from a real
 * registration, which is the one way this interface could lie.
 */
function SampleDataMarker() {
  return (
    <p className="shrink-0 rounded-full border border-[var(--ev-gold)]/40 px-3 py-1 text-[0.75rem] text-[var(--ev-gold)]">
      دادهٔ نمونه — به سرور متصل نیست
    </p>
  );
}
