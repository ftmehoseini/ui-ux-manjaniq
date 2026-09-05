import type { Metadata } from "next";
import * as React from "react";
import { Container, Section, TrajectoryArc } from "@/components/marketing/shell";
import { Card } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "حریم خصوصی و داده‌ها",
  description: "چه اطلاعاتی از تو نگه می‌داریم، چه کسی آن را می‌بیند و برای چه استفاده می‌شود.",
};

const SECTIONS = [
  {
    title: "پروفایل تو عمومی نیست",
    body: "پروفایل اعضا برای مرور عمومی باز نیست و در موتورهای جست‌وجو نمایه نمی‌شود. طرف مقابل ابتدا فقط دلیل پیشنهاد و معرفی کوتاه تو را می‌بیند.",
  },
  {
    title: "نیازهایت برای ساخت پیشنهاد است",
    body: "نیازها و توانمندی‌هایی که ثبت می‌کنی برای پیدا کردن افراد مرتبط استفاده می‌شود. این اطلاعات به‌صورت عمومی منتشر نمی‌شود و در اختیار افرادی که با تو پیشنهاد مشترک ندارند قرار نمی‌گیرد.",
  },
  {
    title: "اطلاعات کامل بعد از پذیرش معرفی",
    body: "بخش‌هایی از پروفایل — مانند راه ارتباطی — تنها زمانی نمایش داده می‌شود که هر دو طرف معرفی را پذیرفته باشند.",
  },
  {
    title: "نتیجه‌هایی که ثبت می‌کنی خصوصی است",
    body: "یادداشت‌ها و نتیجه‌هایی که برای هر ارتباط ثبت می‌کنی فقط برای خودت نمایش داده می‌شود و برای بهبود پیشنهادهای بعدی‌ات استفاده می‌شود. انتشار عمومی هر نتیجه فقط با اجازهٔ صریح خودت انجام می‌شود.",
  },
  {
    title: "برداشت‌های منجنیق از اطلاعات تو",
    body: "منجنیق ممکن است از اطلاعات ثبت‌شده برداشت‌هایی بسازد تا پیشنهادها مرتبط‌تر شوند. این برداشت‌ها همیشه جدا از گفتهٔ خودت علامت می‌خورند و جایگزین اطلاعات اعلامی تو نمی‌شوند.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <section className="grain relative overflow-hidden pt-14 pb-16 sm:pt-20">
        <TrajectoryArc className="pointer-events-none absolute -top-4 left-0 h-64 w-[70%] text-brand/12" />
        <Container className="relative">
          <p className="t-overline text-accent">حریم خصوصی</p>
          <h1 className="t-display mt-5 max-w-3xl text-ink">حریم خصوصی و داده‌ها</h1>
          <p className="t-lead mt-6 max-w-2xl text-muted">
            منجنیق بر پایهٔ اطلاعاتی کار می‌کند که خودت وارد می‌کنی. این صفحه می‌گوید آن اطلاعات
            کجا می‌رود و چه کسی می‌بیند.
          </p>
        </Container>
      </section>

      <Section tone="muted">
        <ul className="flex max-w-prose flex-col gap-4">
          {SECTIONS.map((section) => (
            <li key={section.title}>
              <Card>
                <h2 className="t-h3 text-ink">{section.title}</h2>
                <p className="t-body mt-2 text-muted">{section.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
