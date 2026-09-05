import * as React from "react";
import { Target } from "lucide-react";
import { getApi } from "@/lib/api";
import type { Opportunity } from "@/lib/types";
import { AppPage, PageHeader } from "@/components/layout/page-header";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { OpportunityCard } from "@/components/domain/opportunity-card";

export const metadata = { title: "فرصت‌ها" };

/**
 * Opportunity discovery: relevance that is not attached to a specific person.
 *
 * Kept as its own route rather than a tab inside matches, so the two can grow
 * independently and later interleave in one feed without moving either.
 */
export default async function OpportunitiesPage() {
  let opportunities: readonly Opportunity[] | null = null;
  try {
    opportunities = await getApi().listOpportunities();
  } catch {
    opportunities = null;
  }

  return (
    <AppPage>
      <PageHeader
        title="فرصت‌ها"
        description="فرصت‌هایی که با نیازهای ثبت‌شدهٔ تو هم‌خوانی دارند — بدون اینکه لازم باشد کسی را بشناسی."
      />

      <div className="mt-8">
        {opportunities === null ? (
          <ErrorState description="فرصت‌ها بارگذاری نشد. چند لحظه بعد دوباره تلاش کن." />
        ) : opportunities.length === 0 ? (
          <EmptyState
            icon={<Target className="size-8" aria-hidden />}
            title="فعلاً فرصت مرتبطی نداریم"
            description="فرصت‌ها بر اساس نیازهای ثبت‌شدهٔ تو انتخاب می‌شوند. با دقیق‌تر کردن نیازهایت، احتمال پیدا شدن فرصت مرتبط بیشتر می‌شود."
            action={<ButtonLink href="/app/profile#needs">مرور نیازها</ButtonLink>}
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {opportunities.map((opportunity) => (
              <li key={opportunity.id}>
                <OpportunityCard opportunity={opportunity} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppPage>
  );
}
