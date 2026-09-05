"use client";

import * as React from "react";
import { track } from "@/lib/analytics";
import type { Relevance } from "@/lib/types";
import { Card } from "@/components/ui/primitives";
import { faPercent } from "@/lib/format";

/**
 * The relevance figure on the detail page.
 *
 * Here the basis is always expanded — there is room for it, and the number is
 * only meaningful alongside what produced it. When the engine returns no
 * explainable score, the panel says so instead of showing a figure.
 */
export function MatchRelevancePanel({
  matchId,
  relevance,
}: {
  matchId: string;
  relevance: Relevance | null;
}) {
  React.useEffect(() => {
    if (relevance) {
      track({ name: "match_explanation_opened", matchId, surface: "detail" });
    }
  }, [matchId, relevance]);

  if (!relevance) {
    return (
      <Card padding="lg">
        <h2 className="t-h3 text-ink">درجهٔ هم‌خوانی</h2>
        <p className="t-small mt-2 text-muted">
          برای این پیشنهاد عدد هم‌خوانی محاسبه نکرده‌ایم. عددی که نتوانیم دلیلش را نشان بدهیم،
          نشان نمی‌دهیم — دلایل بالا مبنای این پیشنهاد است.
        </p>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="t-h3 text-ink">درجهٔ هم‌خوانی</h2>
        <span className="text-xl font-semibold text-ink">{faPercent(relevance.score)}</span>
      </div>
      <p className="t-small mt-2 text-muted">این عدد از این موارد ساخته شده است:</p>
      <ul className="mt-3 flex list-disc flex-col gap-1.5 ps-5 text-muted marker:text-faint">
        {relevance.basis.map((item) => (
          <li key={item} className="t-small">
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
