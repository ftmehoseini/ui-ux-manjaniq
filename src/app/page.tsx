import type { Metadata } from "next";
import {
  EventRegistrationPage,
  defaultEventSlug,
  loadEvent,
} from "@/components/registration/event-registration-page";

export async function generateMetadata(): Promise<Metadata> {
  const event = await loadEvent(defaultEventSlug());
  if (!event) return { title: "ثبت‌نام رویداد" };
  return {
    title: `ثبت‌نام — ${event.title}${event.edition ? ` ${event.edition}` : ""}`,
    description: event.tagline,
  };
}

/**
 * The front door.
 *
 * This site exists to register people for one event at a time, so the root is
 * that event's registration stage rather than a landing page that links to it.
 * Which event it is comes from `NEXT_PUBLIC_EVENT_SLUG`.
 */
export default async function HomeRoute() {
  return <EventRegistrationPage slug={defaultEventSlug()} />;
}
