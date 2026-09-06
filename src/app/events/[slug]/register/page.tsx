import type { Metadata } from "next";
import { EventRegistrationPage, loadEvent } from "@/components/registration/event-registration-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await loadEvent(slug);
  if (!event) return { title: "رویداد پیدا نشد" };
  return {
    title: `ثبت‌نام — ${event.title}${event.edition ? ` ${event.edition}` : ""}`,
    description: event.tagline,
  };
}

/** Registration for one named event. */
export default async function EventRegisterRoute({ params }: PageProps) {
  const { slug } = await params;
  return <EventRegistrationPage slug={slug} />;
}
