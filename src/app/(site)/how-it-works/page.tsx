import type { Metadata } from "next";
import * as React from "react";
import { PenLine, Sparkles, Tags } from "lucide-react";
import { MATCHING, SELECTION, STEPS } from "@/content/home";
import { faDigits } from "@/lib/format";
import { Container, EditorialHead, Section, TrajectoryArc } from "@/components/marketing/shell";
import { MatchAnatomy } from "@/components/marketing/match-anatomy";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "منجنیق چطور کار می‌کند",
  description:
    "از نوشتن نیاز تا ثبت نتیجه: روش ساخت پیشنهاد، معیارهای انتخاب شرکت‌کننده و اینکه چه چیزی گفتهٔ عضو است و چه چیزی برداشت منجنیق.",
};

const PROVENANCE_EXPLAINER = [
  {
    icon: <PenLine className="size-5" aria-hidden />,
    title: "گفتهٔ خود عضو",
    detail: "چیزی که شخص با دست خودش در پروفایلش نوشته است. ما تغییرش نمی‌دهیم.",
  },
  {
    icon: <Tags className="size-5" aria-hidden />,
    title: "دستهٔ ثبت‌شده",
    detail:
      "همان گفتهٔ عضو، وقتی روی دسته‌بندی منجنیق نشسته باشد تا بشود آن را با نیاز بقیه مقایسه کرد.",
  },
  {
    icon: <Sparkles className="size-5" aria-hidden />,
    title: "برداشت منجنیق",
    detail:
      "نتیجه‌گیری ما از اطلاعات موجود. همیشه جدا علامت می‌خورد و هیچ‌وقت به‌جای حرف خود عضو جا زده نمی‌شود.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <section className="grain relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-20">
        <TrajectoryArc className="pointer-events-none absolute -top-6 left-0 h-72 w-[80%] text-brand/12" />
        <Container className="relative">
          <p className="t-overline text-accent">روش کار</p>
          <h1 className="t-display mt-5 max-w-3xl text-ink">منجنیق چطور کار می‌کند</h1>
          <p className="t-lead mt-7 max-w-2xl text-muted">
            منجنیق آدم‌ها را تصادفی به هم وصل نمی‌کند. هر پیشنهاد از روی نیاز اعلامی دو طرف
            ساخته می‌شود و دلیلش پیش از هر گفت‌وگو به هر دو نفر گفته می‌شود.
          </p>
        </Container>
      </section>

      <Section tone="surface" labelledBy="steps-heading">
        <EditorialHead index={1} label="مسیر" id="steps-heading" title="چهار قدم" />
        <ol className="mt-12">
          {STEPS.map((step) => (
            <li
              key={step.index}
              className="rule-t grid gap-3 py-8 sm:grid-cols-12 sm:gap-8 last:rule-b"
            >
              <span
                aria-hidden
                className="font-[family-name:var(--font-display)] text-lg font-bold text-accent sm:col-span-1"
              >
                {step.index}
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-ink sm:col-span-4">
                {step.title}
              </h3>
              <p className="t-body-lg text-muted sm:col-span-7">{step.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="matching" labelledBy="matching-heading">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="t-overline text-accent">۰۲ — ساخت پیشنهاد</p>
            <h2 id="matching-heading" className="t-h1 mt-4 text-ink">
              {MATCHING.title}
            </h2>
            <p className="t-lead mt-6 text-muted">{MATCHING.body}</p>

            <div className="mt-8 flex flex-col gap-6">
              <div className="rule-t pt-5">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-ink">
                  پوشش دوطرفه شرط لازم است
                </h3>
                <p className="t-body mt-2 text-muted">
                  اگر فقط نیاز تو پوشش داده شود و تو چیزی برای دادن نداشته باشی، پیشنهادی ساخته
                  نمی‌شود. رابطه‌ای که یک‌طرفه شروع شود معمولاً همان‌جا تمام می‌شود.
                </p>
              </div>
              <div className="rule-t pt-5">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-ink">
                  عدد بدون دلیل نشان نمی‌دهیم
                </h3>
                <p className="t-body mt-2 text-muted">
                  اگر برای یک پیشنهاد درصدی می‌بینی، همان‌جا می‌توانی بازش کنی و ببینی از کجا
                  آمده. هر جا نتوانیم دلیل بدهیم، عددی هم نشان نمی‌دهیم.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <MatchAnatomy />
          </div>
        </div>
      </Section>

      <Section tone="deep" labelledBy="provenance-heading">
        <EditorialHead
          index={3}
          label="شفافیت"
          id="provenance-heading"
          title="سه نوع اطلاعات، سه نشانهٔ متفاوت"
          lead="در تمام محصول می‌توانی تشخیص بدهی هر جمله از کجا آمده است."
          tone="deep"
        />
        <ul className="mt-12 grid gap-px bg-white/15 sm:grid-cols-3">
          {PROVENANCE_EXPLAINER.map((item) => (
            <li key={item.title} className="bg-deep p-6">
              <span className="text-accent-on-deep">{item.icon}</span>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-on-deep">
                {item.title}
              </h3>
              <p className="t-small mt-2 text-on-deep-muted">{item.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="selection" tone="muted" labelledBy="selection-heading">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="t-overline text-accent">۰۴ — انتخاب شرکت‌کننده</p>
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

      <Section labelledBy="privacy-heading">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="t-overline text-accent">۰۵ — حریم خصوصی</p>
            <h2 id="privacy-heading" className="t-h1 mt-4 text-ink">
              پروفایل تو عمومی نیست
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="t-lead text-muted">
              پروفایل‌های منجنیق برای مرور عمومی باز نیستند. طرف مقابل ابتدا فقط دلیل پیشنهاد و
              معرفی کوتاه تو را می‌بیند؛ بقیهٔ اطلاعات بعد از پذیرش معرفی از سوی هر دو طرف نمایش
              داده می‌شود.
            </p>
            <p className="t-body mt-6 border-s-2 border-accent-border ps-4 text-muted">
              نیازهایی که ثبت می‌کنی برای ساخت پیشنهاد استفاده می‌شود، نه برای نمایش عمومی.
            </p>
            <ButtonLink href="/privacy" variant="secondary" className="mt-8">
              جزئیات حریم خصوصی
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section tone="brand" size="tall" className="overflow-hidden">
        <TrajectoryArc className="pointer-events-none absolute inset-x-0 bottom-0 h-48 w-full text-white/10" />
        <div className="relative max-w-2xl">
          <h2 className="t-h1">آماده‌ای شروع کنی؟</h2>
          <p className="t-lead mt-5 opacity-90">
            ساخت پروفایل چند دقیقه طول می‌کشد و رایگان است.
          </p>
          <ButtonLink href="/app/onboarding" size="lg" variant="inverse" className="mt-8">
            ساخت پروفایل
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
