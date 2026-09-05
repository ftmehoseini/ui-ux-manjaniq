"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { GOAL_LABELS } from "@/lib/taxonomy";
import type { GoalKind, Match } from "@/lib/types";
import { FilterChip } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { MatchCard } from "./match-card";

/**
 * The match feed with its filters.
 *
 * Filtering is client-side over an already-loaded list: the set a member sees
 * at once is small by design, and a round trip per chip would make the
 * interaction feel heavier than the decision it supports.
 */
export function MatchList({ matches }: { matches: readonly Match[] }) {
  const [filter, setFilter] = React.useState<GoalKind | "all">("all");
  const toast = useToast();

  // Only offer filters that would actually return something.
  const available = React.useMemo(() => {
    const kinds = new Set<GoalKind>();
    for (const match of matches) kinds.add(match.forYou.need.kind);
    return [...kinds];
  }, [matches]);

  const visible = React.useMemo(
    () => (filter === "all" ? matches : matches.filter((m) => m.forYou.need.kind === filter)),
    [matches, filter],
  );

  if (matches.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles className="size-8" aria-hidden />}
        title="هنوز پیشنهادی برای تو نساخته‌ایم"
        description="برای ساخت پیشنهادهای دقیق‌تر، اول نیازها و توانمندی‌هایت را کامل کن. هر چه نیازت مشخص‌تر باشد، آدم‌هایی که به تو پیشنهاد می‌شوند مرتبط‌ترند."
        action={<ButtonLink href="/app/profile#needs">کامل‌کردن پروفایل</ButtonLink>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {available.length > 1 && (
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <FilterChip selected={filter === "all"} onClick={() => setFilter("all")}>
            همه
          </FilterChip>
          {available.map((kind) => (
            <FilterChip
              key={kind}
              selected={filter === kind}
              onClick={() => setFilter(kind)}
            >
              {GOAL_LABELS[kind]}
            </FilterChip>
          ))}
        </div>
      )}

      <p role="status" aria-live="polite" className="sr-only">
        {`${visible.length.toLocaleString("fa-IR")} پیشنهاد`}
      </p>

      {visible.length === 0 ? (
        <EmptyState
          title="با این فیلتر پیشنهادی نداری"
          description="فیلتر را بردار تا بقیهٔ پیشنهادها را ببینی، یا نیاز تازه‌ای در پروفایلت ثبت کن."
          action={<ButtonLink href="/app/profile#needs" variant="secondary">افزودن نیاز</ButtonLink>}
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((match) => (
            <li key={match.id}>
              <MatchCard
                match={match}
                onRequestIntroduction={(selected) =>
                  toast.show(
                    `درخواست معرفی به ${selected.person.name} ثبت شد. وقتی پاسخ بدهد خبرت می‌کنیم.`,
                  )
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
