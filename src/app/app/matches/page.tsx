import * as React from "react";
import { getApi } from "@/lib/api";
import type { Match } from "@/lib/types";
import { AppPage, PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/ui/states";
import { MatchList } from "@/components/domain/match-list";

export const metadata = { title: "پیشنهادها" };

export default async function MatchesPage() {
  let matches: readonly Match[] | null = null;
  try {
    matches = await getApi().listMatches();
  } catch {
    matches = null;
  }

  return (
    <AppPage>
      <PageHeader
        title="پیشنهادها"
        description="هر پیشنهاد وقتی ساخته می‌شود که نیاز تو و نیاز طرف مقابل همدیگر را پوشش بدهند."
      />
      <div className="mt-8">
        {matches === null ? (
          <ErrorState description="پیشنهادها بارگذاری نشد. چند لحظه بعد دوباره تلاش کن." />
        ) : (
          <MatchList matches={matches} />
        )}
      </div>
    </AppPage>
  );
}
