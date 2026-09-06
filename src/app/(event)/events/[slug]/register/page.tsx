import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getApi } from "@/lib/api";
import type { EventDetail } from "@/lib/types";
import { EventBackground } from "@/components/registration/event-background";
import { EventBanner } from "@/components/registration/event-banner";
import { EventInfoBar } from "@/components/registration/event-info-bar";
import { RegistrationPanel } from "@/components/registration/registration-panel";
import { toRegistrationEvent } from "@/components/registration/event-view";

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
    title: `ثبت‌نام — ${event.title}`,
    description: event.tagline,
    robots: { index: false, follow: true },
  };
}

/**
 * The registration stage.
 *
 * Layout is a centred column — banner, card, information bar — over a darkened
 * auditorium. Nothing is absolutely positioned except the background itself,
 * so the whole composition reflows on a phone instead of being scaled down.
 */
export default async function EventRegistrationPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);
  if (!event) notFound();

  const view = toRegistrationEvent(event);

  return (
    <div className="event-stage relative flex min-h-dvh flex-col bg-[var(--ev-ground)]">
      <EventBackground {...(view.backdropUrl ? { imageUrl: view.backdropUrl } : {})} />

      <div className="relative flex flex-1 flex-col items-center px-5 py-6 sm:px-6 sm:py-10">
        <div className="flex w-full max-w-[1100px] flex-1 flex-col items-center gap-6 sm:gap-8">
          <div className="w-full shrink-0">
            <Link
              href={`/events/${event.slug}`}
              className="ev-on-dark-focus inline-flex items-center gap-1.5 rounded-md text-[0.875rem] text-[var(--ev-on-dark-muted)] transition-colors hover:text-[var(--ev-on-dark)]"
            >
              <ArrowRight className="size-4" aria-hidden />
              بازگشت به صفحهٔ رویداد
            </Link>
          </div>

          {/* Banner and card are one centred group; the information bar keeps
              to the foot of the stage when the viewport is taller than them. */}
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 sm:gap-8">
            <EventBanner
              {...(view.bannerUrl ? { src: view.bannerUrl, alt: `تصویر ${view.title}` } : {})}
              className="max-w-[1000px]"
            />

            <RegistrationPanel event={view} className="max-w-[34.5rem]" />
          </div>

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
