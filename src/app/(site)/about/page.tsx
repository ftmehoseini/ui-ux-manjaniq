import type { Metadata } from "next";
import * as React from "react";
import { Container, Section, TrajectoryArc } from "@/components/marketing/shell";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "دربارهٔ ما",
  description: "منجنیق برای چه ساخته شده و بر چه اصولی کار می‌کند.",
};

const PRINCIPLES = [
  {
    title: "فرصت مهم‌تر از شبکه‌سازی است",
    detail:
      "یک ارتباط مرتبط از ده آشنایی تصادفی ارزشمندتر است. ما تعداد ارتباط را معیار موفقیت نمی‌دانیم.",
  },
  {
    title: "قهرمان، آدم‌ها هستند نه فناوری",
    detail:
      "منجنیق پیشنهاد می‌سازد و دلیلش را توضیح می‌دهد. تصمیم، گفت‌وگو و رابطه کار خود آدم‌هاست.",
  },
  {
    title: "قبل از تعهد، اعتماد",
    detail:
      "پیش از اینکه چیزی از تو بخواهیم، نشان می‌دهیم چطور کار می‌کنیم، چه کسانی داخل هستند و بر چه اساسی انتخاب می‌شوند.",
  },
  {
    title: "چیزی را که نمی‌توانیم نشان بدهیم، ادعا نمی‌کنیم",
    detail:
      "بخش‌هایی از این سایت خالی است، چون هنوز نتیجهٔ واقعی برای نشان‌دادن نداریم. پرکردنشان با محتوای ساختگی کار سختی نبود؛ درست نبود.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="grain relative overflow-hidden pt-14 pb-16 sm:pt-20">
        <TrajectoryArc className="pointer-events-none absolute -top-4 left-0 h-64 w-[70%] text-brand/12" />
        <Container className="relative">
          <p className="t-overline text-accent">دربارهٔ ما</p>
          <h1 className="t-display mt-5 max-w-3xl text-ink">دربارهٔ منجنیق</h1>
          <p className="t-lead mt-6 max-w-2xl text-muted">
            منجنیق برای یک مسئلهٔ مشخص ساخته شده است: آدم‌ها در رویدادهای حرفه‌ای با افراد زیادی
            آشنا می‌شوند و بعد هیچ اتفاقی نمی‌افتد. ما می‌خواهیم آشنایی تصادفی جای خودش را به
            معرفی‌های مرتبط و هدفمند بدهد.
          </p>
        </Container>
      </section>

      <Section tone="muted" labelledBy="principles-heading">
        <SectionHeader overline="اصول" title="بر چه اساسی کار می‌کنیم" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((principle) => (
            <li key={principle.title}>
              <Card className="h-full">
                <h3 className="t-h3 text-ink">{principle.title}</h3>
                <p className="t-body mt-2 text-muted">{principle.detail}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Card padding="lg" className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="t-h2 text-ink">می‌خواهی امتحانش کنی؟</h2>
            <p className="t-body mt-2 text-muted">
              پروفایلت را بساز و ببین چه کسی — و با چه دلیلی — به تو پیشنهاد می‌شود.
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
