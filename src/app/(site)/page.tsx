import * as React from "react";
import { ArrowDown, Check, ShieldCheck } from "lucide-react";
import { getApi } from "@/lib/api";
import { OUTCOME_STORIES } from "@/content/proof";
import {
  FAQ_ITEMS,
  HERO,
  MATCHING,
  OUTCOME_LADDER,
  PROBLEM,
  SELECTION,
  STEPS,
} from "@/content/home";
import { Container, Section, Step } from "@/components/marketing/shell";
import { Faq } from "@/components/marketing/faq";
import { ButtonLink } from "@/components/ui/button";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/states";
import { EventCard } from "@/components/domain/event-card";
import { OutcomeStoryCard } from "@/components/marketing/story-card";

export default async function HomePage() {
  // A homepage must render even when the backend is unreachable, so the event
  // section degrades to nothing rather than failing the whole route.
  const events = await getApi()
    .listEvents()
    .catch(() => []);
  const upcoming = events.find((event) => event.state === "open" || event.state === "announced");

  return (
    <>
      {/* 1 — Hero: the outcome, not the technology. */}
      <Section className="pt-14 sm:pt-20">
        <div className="max-w-3xl">
          <h1 className="t-display text-ink">{HERO.title}</h1>
          <p className="t-body-lg mt-5 max-w-prose text-muted">{HERO.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={HERO.primaryCta.href} size="lg">
              {HERO.primaryCta.label}
            </ButtonLink>
            {upcoming && (
              <ButtonLink href={`/events/${upcoming.slug}`} variant="secondary" size="lg">
                مشاهده رویداد
              </ButtonLink>
            )}
            {!upcoming && (
              <ButtonLink href={HERO.secondaryCta.href} variant="secondary" size="lg">
                {HERO.secondaryCta.label}
              </ButtonLink>
            )}
          </div>
          <p className="t-caption mt-4 text-faint">
            ساخت پروفایل رایگان است و برای دیدن پیشنهادها لازم نیست چیزی بخری.
          </p>
        </div>
      </Section>

      {/* 2 — What counts as success here. Stands in for a metrics strip, which
             would need numbers the product has not published. */}
      <Section tone="muted" labelledBy="outcomes-heading">
        <SectionHeader
          overline="نتیجه"
          title="منجنیق موفقیت را این‌طور می‌شمارد"
          description="تعداد آشنایی، بازدید پروفایل و اندازهٔ شبکه معیار ما نیست. این چهار مرحله است که برای تو ارزش می‌سازد."
        />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OUTCOME_LADDER.map((item, index) => (
            <li key={item.title}>
              <Card className="h-full">
                <span className="t-overline text-brand">مرحلهٔ {["۱", "۲", "۳", "۴"][index]}</span>
                <h3 className="t-h3 mt-2 text-ink">{item.title}</h3>
                <p className="t-small mt-1.5 text-muted">{item.detail}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      {/* 3 — The problem, named plainly. */}
      <Section labelledBy="problem-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="problem-heading" className="t-h1 text-ink">
              {PROBLEM.title}
            </h2>
            <p className="t-body-lg mt-4 text-muted">{PROBLEM.body}</p>
          </div>
          <ul className="flex flex-col gap-4 self-center">
            {PROBLEM.points.map((point) => (
              <li
                key={point}
                className="t-body flex gap-3 rounded-lg border border-line bg-surface p-4 text-muted"
              >
                <ArrowDown className="mt-1 size-4 shrink-0 text-faint" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 4 — How it works. */}
      <Section tone="muted" labelledBy="how-heading">
        <SectionHeader
          overline="روش کار"
          title="منجنیق چطور کار می‌کند"
          description="چهار قدم، از نوشتن نیاز تا ثبت نتیجه."
          action={
            <ButtonLink href="/how-it-works" variant="secondary">
              جزئیات کامل
            </ButtonLink>
          }
        />
        <ol className="mt-8 grid gap-8 sm:grid-cols-2">
          {STEPS.map((step) => (
            <Step key={step.index} index={step.index} title={step.title}>
              {step.detail}
            </Step>
          ))}
        </ol>
      </Section>

      {/* 5 + 9 — Participant quality and how selection actually works. */}
      <Section id="selection" labelledBy="selection-heading">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 id="selection-heading" className="t-h1 text-ink">
              {SELECTION.title}
            </h2>
            <p className="t-body-lg mt-4 text-muted">{SELECTION.body}</p>
          </div>
          <ul className="flex flex-col gap-3">
            {SELECTION.criteria.map((criterion) => (
              <li key={criterion.title}>
                <Card className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                  <div>
                    <h3 className="t-h3 text-ink">{criterion.title}</h3>
                    <p className="t-small mt-1 text-muted">{criterion.detail}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 6 — The matching mechanism, shown rather than described. */}
      <Section tone="muted" labelledBy="matching-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h2 id="matching-heading" className="t-h1 text-ink">
              {MATCHING.title}
            </h2>
            <p className="t-body-lg mt-4 text-muted">{MATCHING.body}</p>
            <p className="t-small mt-4 text-muted">{MATCHING.note}</p>
          </div>

          {/* An illustrative shape of a match explanation — labelled as such,
              with no invented person attached to it. */}
          <figure className="rounded-xl border border-line bg-surface p-5">
            <figcaption className="t-overline mb-4 text-muted">
              ساختار توضیح هر پیشنهاد
            </figcaption>
            <div className="grid gap-3 sm:grid-cols-2">
              <ExplanationLeg
                topLabel="تو دنبال این هستی"
                bottomLabel="او می‌تواند اینجا کمک کند"
                tone="brand"
              />
              <ExplanationLeg
                topLabel="او دنبال این است"
                bottomLabel="تو می‌توانی اینجا کمک کنی"
                tone="neutral"
              />
            </div>
            <p className="t-caption mt-4 text-faint">
              پیشنهاد فقط وقتی ساخته می‌شود که هر دو ستون پر باشند.
            </p>
          </figure>
        </div>
      </Section>

      {/* 7 — The next event, if one is open. */}
      {upcoming && (
        <Section labelledBy="event-heading">
          <SectionHeader
            overline="رویداد پیش رو"
            title="گفت‌وگوها اینجا حضوری اتفاق می‌افتد"
            description="چیدمان میزها از روی نیاز و توانمندی ثبت‌شدهٔ شرکت‌کننده‌ها انجام می‌شود."
          />
          <div className="mt-8 max-w-xl">
            <EventCard event={upcoming} />
          </div>
        </Section>
      )}

      {/* 8 — Outcome stories. Empty until real, consented ones exist. */}
      <Section tone="muted" labelledBy="stories-heading">
        <SectionHeader
          overline="نتیجه‌های واقعی"
          title="چه چیزی از این گفت‌وگوها درآمده"
          description="فقط نتیجه‌هایی را منتشر می‌کنیم که خود اعضا ثبت کرده و اجازهٔ انتشارش را داده‌اند."
        />
        <div className="mt-8">
          {OUTCOME_STORIES.length === 0 ? (
            <EmptyState
              title="هنوز نتیجه‌ای برای انتشار نداریم"
              description="ترجیح می‌دهیم این بخش خالی بماند تا اینکه با نمونه‌های ساختگی پر شود. اولین نتیجه‌ها بعد از رویداد پیش رو و با اجازهٔ خود اعضا اینجا منتشر می‌شوند."
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {OUTCOME_STORIES.map((story) => (
                <li key={story.id}>
                  <OutcomeStoryCard story={story} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* 10 — FAQ. */}
      <Section labelledBy="faq-heading">
        <SectionHeader overline="سؤال‌های رایج" title="چیزهایی که معمولاً می‌پرسند" />
        <div className="mt-8 max-w-prose">
          <Faq items={FAQ_ITEMS} />
        </div>
      </Section>

      {/* 11 — Final CTA. */}
      <section className="bg-brand py-16 text-on-brand sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="t-h1">از یک ارتباط درست شروع کن</h2>
            <p className="t-body-lg mt-4 opacity-90">
              پروفایلت را بساز، نیازت را بنویس و ببین منجنیق چه کسی را — و با چه دلیلی — به تو
              پیشنهاد می‌دهد.
            </p>
            <div className="mt-8">
              <ButtonLink
                href="/app/onboarding"
                size="lg"
                className="bg-surface text-brand hover:bg-surface-muted"
              >
                ساخت پروفایل
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/** Abstract shape of one side of a match explanation. Carries no fake content. */
function ExplanationLeg({
  topLabel,
  bottomLabel,
  tone,
}: {
  topLabel: string;
  bottomLabel: string;
  tone: "brand" | "neutral";
}) {
  return (
    <div
      className={
        tone === "brand"
          ? "rounded-lg border border-brand-border bg-brand-subtle/60 p-4"
          : "rounded-lg border border-line bg-surface-muted/70 p-4"
      }
    >
      <p className="t-overline text-muted">{topLabel}</p>
      <div className="mt-2 h-2.5 w-4/5 rounded-full bg-line-strong/70" aria-hidden />
      <ArrowDown className="my-3 size-4 text-faint" aria-hidden />
      <p className="t-overline text-muted">{bottomLabel}</p>
      <div className="mt-2 h-2.5 w-3/5 rounded-full bg-line-strong/70" aria-hidden />
      <p className="t-caption mt-3 inline-flex items-center gap-1 text-success">
        <Check className="size-3.5" aria-hidden />
        پوشش دوطرفه
      </p>
    </div>
  );
}
