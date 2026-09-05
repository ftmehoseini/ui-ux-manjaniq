import type { Metadata } from "next";
import * as React from "react";
import { Eye, PenLine, ShieldCheck, Sparkles, Tags } from "lucide-react";
import { MATCHING, SELECTION, STEPS } from "@/content/home";
import { Section, Step } from "@/components/marketing/shell";
import { ButtonLink } from "@/components/ui/button";
import { Card, SectionHeader } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "منجنیق چطور کار می‌کند",
  description:
    "از نوشتن نیاز تا ثبت نتیجه: روش ساخت پیشنهاد، معیارهای انتخاب شرکت‌کننده و اینکه چه چیزی گفتهٔ عضو است و چه چیزی برداشت منجنیق.",
};

/** The three kinds of information in the product, in members' language. */
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
      <Section className="pt-14">
        <div className="max-w-3xl">
          <h1 className="t-display text-ink">منجنیق چطور کار می‌کند</h1>
          <p className="t-body-lg mt-5 text-muted">
            منجنیق آدم‌ها را تصادفی به هم وصل نمی‌کند. هر پیشنهاد از روی نیاز اعلامی دو طرف ساخته
            می‌شود و دلیلش پیش از هر گفت‌وگو به هر دو نفر گفته می‌شود.
          </p>
        </div>
      </Section>

      <Section tone="muted" labelledBy="steps-heading">
        <SectionHeader overline="مسیر" title="چهار قدم" />
        <ol className="mt-8 grid gap-8 sm:grid-cols-2">
          {STEPS.map((step) => (
            <Step key={step.index} index={step.index} title={step.title}>
              {step.detail}
            </Step>
          ))}
        </ol>
      </Section>

      <Section id="matching" labelledBy="matching-heading">
        <SectionHeader
          overline="ساخت پیشنهاد"
          title={MATCHING.title}
          description={MATCHING.body}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="t-h3 text-ink">پوشش دوطرفه شرط لازم است</h3>
            <p className="t-body mt-2 text-muted">
              اگر فقط نیاز تو پوشش داده شود و تو چیزی برای دادن نداشته باشی، پیشنهادی ساخته
              نمی‌شود. رابطه‌ای که یک‌طرفه شروع شود معمولاً همان‌جا تمام می‌شود.
            </p>
          </Card>
          <Card>
            <h3 className="t-h3 text-ink">عدد بدون دلیل نشان نمی‌دهیم</h3>
            <p className="t-body mt-2 text-muted">
              اگر برای یک پیشنهاد درصدی می‌بینی، همان‌جا می‌توانی بازش کنی و ببینی از کجا آمده. هر
              جا نتوانیم دلیل بدهیم، عددی هم نشان نمی‌دهیم.
            </p>
          </Card>
        </div>
      </Section>

      <Section tone="muted" labelledBy="provenance-heading">
        <SectionHeader
          overline="شفافیت"
          title="سه نوع اطلاعات، سه نشانهٔ متفاوت"
          description="در تمام محصول می‌توانی تشخیص بدهی هر جمله از کجا آمده است."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {PROVENANCE_EXPLAINER.map((item) => (
            <li key={item.title}>
              <Card className="h-full">
                <span className="text-brand">{item.icon}</span>
                <h3 className="t-h3 mt-3 text-ink">{item.title}</h3>
                <p className="t-small mt-1.5 text-muted">{item.detail}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="selection" labelledBy="selection-heading">
        <SectionHeader
          overline="انتخاب شرکت‌کننده"
          title={SELECTION.title}
          description={SELECTION.body}
        />
        <ul className="mt-8 flex flex-col gap-3">
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
      </Section>

      <Section tone="muted" labelledBy="privacy-heading">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <h2 id="privacy-heading" className="t-h1 text-ink">
              پروفایل تو عمومی نیست
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <p className="t-body-lg text-muted">
              پروفایل‌های منجنیق برای مرور عمومی باز نیستند. طرف مقابل ابتدا فقط دلیل پیشنهاد و
              معرفی کوتاه تو را می‌بیند؛ بقیهٔ اطلاعات بعد از پذیرش معرفی از سوی هر دو طرف نمایش
              داده می‌شود.
            </p>
            <p className="t-body flex gap-3 rounded-lg border border-line bg-surface p-4 text-muted">
              <Eye className="mt-1 size-4 shrink-0 text-faint" aria-hidden />
              نیازهایی که ثبت می‌کنی برای ساخت پیشنهاد استفاده می‌شود، نه برای نمایش عمومی.
            </p>
            <div>
              <ButtonLink href="/privacy" variant="secondary">
                جزئیات حریم خصوصی
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="cta-heading">
        <Card padding="lg" className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="cta-heading" className="t-h2 text-ink">
              آماده‌ای شروع کنی؟
            </h2>
            <p className="t-body mt-2 text-muted">
              ساخت پروفایل چند دقیقه طول می‌کشد و رایگان است.
            </p>
          </div>
          <ButtonLink href="/app/onboarding" size="lg">
            ساخت پروفایل
          </ButtonLink>
        </Card>
      </Section>
    </>
  );
}
