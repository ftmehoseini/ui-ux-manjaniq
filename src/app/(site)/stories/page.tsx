import type { Metadata } from "next";
import * as React from "react";
import { OUTCOME_STORIES } from "@/content/proof";
import { Container, Section, TrajectoryArc } from "@/components/marketing/shell";
import { EmptyState } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { OutcomeStoryCard } from "@/components/marketing/story-card";

export const metadata: Metadata = {
  title: "نتیجه‌ها",
  description:
    "نتیجه‌هایی که اعضای منجنیق از گفت‌وگوهایشان ثبت کرده‌اند — فقط با اجازهٔ خودشان منتشر می‌شود.",
};

export default function StoriesPage() {
  return (
    <>
      <section className="grain relative overflow-hidden pt-14 pb-16 sm:pt-20">
        <TrajectoryArc className="pointer-events-none absolute -top-4 left-0 h-64 w-[70%] text-brand/12" />
        <Container className="relative">
          <p className="t-overline text-accent">نتیجه‌ها</p>
          <h1 className="t-display mt-5 max-w-3xl text-ink">نتیجه‌ها</h1>
          <p className="t-lead mt-6 max-w-2xl text-muted">
            آنچه اینجا می‌بینی نتیجه‌هایی است که خود اعضا بعد از گفت‌وگو ثبت کرده و اجازهٔ
            انتشارش را داده‌اند. چیزی را که نتوانیم نشان بدهیم، نمی‌نویسیم.
          </p>
        </Container>
      </section>

      <Section tone="muted">
        {OUTCOME_STORIES.length === 0 ? (
          <div className="flex flex-col gap-6">
            <EmptyState
              title="هنوز نتیجه‌ای برای انتشار نداریم"
              description="منجنیق تازه شروع کرده است. تا وقتی نتیجهٔ واقعی و با اجازهٔ عضو نداشته باشیم، این صفحه خالی می‌ماند — پرکردنش با نمونه‌های ساختگی دقیقاً همان کاری است که نمی‌خواهیم بکنیم."
              action={<ButtonLink href="/app/onboarding">ساخت پروفایل</ButtonLink>}
            />
            <Card padding="lg">
              <h2 className="t-h3 text-ink">در این صفحه چه چیزی منتشر می‌شود</h2>
              <ul className="mt-3 flex list-disc flex-col gap-2 ps-5 text-muted marker:text-faint">
                <li className="t-small">نتیجه‌ای که خود عضو در محصول ثبت کرده باشد.</li>
                <li className="t-small">با اجازهٔ صریح همان عضو برای انتشار عمومی.</li>
                <li className="t-small">
                  بدون اغراق در جزئیات و بدون نام‌بردن از شرکتی که اجازه نداده است.
                </li>
              </ul>
            </Card>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OUTCOME_STORIES.map((story) => (
              <li key={story.id}>
                <OutcomeStoryCard story={story} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
