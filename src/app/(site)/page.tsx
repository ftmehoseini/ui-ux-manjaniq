import * as React from "react";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { getApi } from "@/lib/api";
import { faDigits } from "@/lib/format";
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
import {
  Container,
  EditorialHead,
  PhotoFrame,
  Section,
  TrajectoryArc,
} from "@/components/marketing/shell";
import { Faq } from "@/components/marketing/faq";
import { MatchAnatomy } from "@/components/marketing/match-anatomy";
import { OutcomeStoryCard } from "@/components/marketing/story-card";
import { ButtonLink } from "@/components/ui/button";
import { EventFeature } from "@/components/marketing/event-feature";

export default async function HomePage() {
  const events = await getApi()
    .listEvents()
    .catch(() => []);
  const upcoming = events.find((event) => event.state === "open" || event.state === "announced");

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────
          Asymmetric and typographically loud. The arc is the brand's graphic
          signature and draws itself once on arrival. */}
      <section className="grain relative overflow-hidden pt-14 pb-20 sm:pt-24 sm:pb-28">
        <TrajectoryArc
          animate
          className="pointer-events-none absolute -top-8 left-[-10%] h-[420px] w-[130%] text-brand/15 sm:left-0 sm:w-[85%]"
        />
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="t-overline text-accent">شبکهٔ فرصت‌های حرفه‌ای</p>
              <h1 className="t-display mt-5 text-ink">
                آدم درست را
                <br />
                پیدا کن
              </h1>
              <p className="t-lead mt-7 max-w-xl text-muted">{HERO.subtitle}</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={HERO.primaryCta.href} size="lg">
                  {HERO.primaryCta.label}
                </ButtonLink>
                <ButtonLink
                  href={upcoming ? `/events/${upcoming.slug}` : HERO.secondaryCta.href}
                  variant="secondary"
                  size="lg"
                >
                  {upcoming ? "مشاهده رویداد" : HERO.secondaryCta.label}
                </ButtonLink>
              </div>
              <p className="t-caption mt-4 text-faint">
                ساخت پروفایل رایگان است و برای دیدن پیشنهادها لازم نیست چیزی بخری.
              </p>
            </div>

            {/* The product's core claim, stated as a specimen rather than a
                feature card. */}
            <aside className="lg:col-span-4 lg:pt-16">
              <div className="rule-t pt-5">
                <p className="t-overline text-muted">قاعدهٔ منجنیق</p>
                <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold leading-[1.5] text-ink">
                  پیشنهاد فقط وقتی ساخته می‌شود که{" "}
                  <span className="text-accent">هر دو طرف</span> چیزی برای دادن داشته باشند.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* ── 01 · What counts as success ────────────────────────────────────
          A stepped sequence on a rule, not four equal cards. */}
      <Section tone="surface" labelledBy="outcomes-heading">
        <EditorialHead
          index={1}
          label="نتیجه"
          id="outcomes-heading"
          title="منجنیق موفقیت را این‌طور می‌شمارد"
          lead="تعداد آشنایی، بازدید پروفایل و اندازهٔ شبکه معیار ما نیست. این چهار مرحله است که برای تو ارزش می‌سازد."
        />
        <ol className="mt-14 grid gap-px overflow-hidden bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {OUTCOME_LADDER.map((item, index) => (
            <li key={item.title} className="relative bg-surface p-6 sm:p-7">
              <span
                aria-hidden
                className="font-[family-name:var(--font-display)] text-sm font-bold text-accent"
              >
                {faDigits(`0${index + 1}`)}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-ink">
                {item.title}
              </h3>
              <p className="t-small mt-2 text-muted">{item.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── 02 · The problem, on the dark ground ───────────────────────────
          The one place the page raises its voice. */}
      <Section tone="deep" size="tall" labelledBy="problem-heading">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="t-overline text-accent-on-deep">مسئله</p>
            <h2 id="problem-heading" className="t-display mt-5 text-on-deep">
              {PROBLEM.title}
            </h2>
            <p className="t-lead mt-8 max-w-xl text-on-deep-muted">{PROBLEM.body}</p>
          </div>

          <ul className="flex flex-col justify-end lg:col-span-5">
            {PROBLEM.points.map((point) => (
              <li
                key={point}
                className="t-body-lg border-t border-white/15 py-5 text-on-deep-muted last:border-b"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── 03 · How it works ──────────────────────────────────────────────
          Ruled editorial rows. No cards. */}
      <Section labelledBy="how-heading">
        <EditorialHead
          index={3}
          label="روش کار"
          id="how-heading"
          title="از نوشتن نیاز تا ثبت نتیجه"
          action={
            <ButtonLink href="/how-it-works" variant="ghost">
              جزئیات کامل
              <ArrowLeft className="size-4" aria-hidden />
            </ButtonLink>
          }
        />
        <ol className="mt-12">
          {STEPS.map((step) => (
            <li
              key={step.index}
              className="rule-t grid gap-3 py-8 sm:grid-cols-12 sm:gap-8 last:rule-b"
            >
              <div className="sm:col-span-1">
                <span
                  aria-hidden
                  className="font-[family-name:var(--font-display)] text-lg font-bold text-accent"
                >
                  {step.index}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-ink sm:col-span-4">
                {step.title}
              </h3>
              <p className="t-body-lg text-muted sm:col-span-7">{step.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── 04 · Participant quality ───────────────────────────────────────*/}
      <Section id="selection" tone="muted" labelledBy="selection-heading">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="t-overline text-accent">۰۴ — انتخاب</p>
            <h2 id="selection-heading" className="t-h1 mt-4 text-ink">
              {SELECTION.title}
            </h2>
            <p className="t-lead mt-6 text-muted">{SELECTION.body}</p>
          </div>

          <dl className="lg:col-span-7 lg:pt-14">
            {SELECTION.criteria.map((criterion, index) => (
              <div key={criterion.title} className="rule-t py-6 last:rule-b">
                <dt className="flex items-baseline gap-4">
                  <span
                    aria-hidden
                    className="font-[family-name:var(--font-display)] text-sm font-bold text-accent"
                  >
                    {faDigits(`0${index + 1}`)}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-xl font-bold text-ink">
                    {criterion.title}
                  </span>
                </dt>
                <dd className="t-body mt-2 ps-8 text-muted">{criterion.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* ── 05 · The matching mechanism, shown at size ─────────────────────*/}
      <Section labelledBy="matching-heading">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="t-overline text-accent">۰۵ — ساخت پیشنهاد</p>
            <h2 id="matching-heading" className="t-h1 mt-4 text-ink">
              {MATCHING.title}
            </h2>
            <p className="t-lead mt-6 text-muted">{MATCHING.body}</p>
            <p className="t-small mt-5 border-s-2 border-accent-border ps-4 text-muted">
              {MATCHING.note}
            </p>
          </div>
          <div className="lg:col-span-7">
            <MatchAnatomy />
          </div>
        </div>
      </Section>

      {/* ── 06 · The next event ────────────────────────────────────────────*/}
      {upcoming && (
        <Section tone="surface" labelledBy="event-heading">
          <EditorialHead
            index={6}
            label="رویداد پیش رو"
            id="event-heading"
            title="گفت‌وگوها اینجا حضوری اتفاق می‌افتد"
            lead="چیدمان میزها از روی نیاز و توانمندی ثبت‌شدهٔ شرکت‌کننده‌ها انجام می‌شود."
          />
          <div className="mt-12">
            <EventFeature event={upcoming} />
          </div>
        </Section>
      )}

      {/* ── 07 · Outcomes. Empty until real, consented ones exist. ─────────*/}
      <Section tone="muted" labelledBy="stories-heading">
        <EditorialHead
          index={7}
          label="نتیجه‌های واقعی"
          id="stories-heading"
          title="چه چیزی از این گفت‌وگوها درآمده"
        />
        <div className="mt-12">
          {OUTCOME_STORIES.length === 0 ? (
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-6">
                <p className="font-[family-name:var(--font-display)] text-2xl font-bold leading-[1.6] text-ink sm:text-3xl">
                  این بخش عمداً خالی است.
                </p>
                <p className="t-lead mt-5 text-muted">
                  تا وقتی نتیجهٔ واقعی و با اجازهٔ خود عضو نداشته باشیم، چیزی اینجا نمی‌نویسیم.
                  پر کردنش با نمونه‌های ساختگی کار سختی نبود؛ درست نبود.
                </p>
                <p className="t-small mt-6 text-muted">
                  اولین نتیجه‌ها بعد از رویداد پیش رو منتشر می‌شوند.
                </p>
              </div>
              <PhotoFrame
                className="lg:col-span-6"
                ratio="3 / 2"
                placeholder="جای عکس واقعی رویداد — پس از برگزاری اولین دوره"
              />
            </div>
          ) : (
            <ul className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
              {OUTCOME_STORIES.map((story) => (
                <li key={story.id} className="bg-surface">
                  <OutcomeStoryCard story={story} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* ── 08 · FAQ ───────────────────────────────────────────────────────*/}
      <Section labelledBy="faq-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="t-overline text-accent">۰۸ — سؤال‌های رایج</p>
            <h2 id="faq-heading" className="t-h1 mt-4 text-ink">
              چیزهایی که معمولاً می‌پرسند
            </h2>
          </div>
          <div className="lg:col-span-8">
            <Faq items={FAQ_ITEMS} />
          </div>
        </div>
      </Section>

      {/* ── Close ──────────────────────────────────────────────────────────*/}
      <Section tone="brand" size="tall" className="overflow-hidden">
        <TrajectoryArc className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full text-white/10" />
        <div className="relative max-w-2xl">
          <h2 className="t-display">از یک ارتباط درست شروع کن</h2>
          <p className="t-lead mt-6 opacity-90">
            پروفایلت را بساز، نیازت را بنویس و ببین منجنیق چه کسی — و با چه دلیلی — به تو
            پیشنهاد می‌دهد.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <ButtonLink href="/app/onboarding" size="lg" variant="inverse">
              ساخت پروفایل
            </ButtonLink>
            <ArrowDown className="size-5 opacity-50" aria-hidden />
          </div>
        </div>
      </Section>
    </>
  );
}
