"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { faDigits } from "@/lib/format";
import { GOAL_LABELS, HORIZON_LABELS } from "@/lib/taxonomy";
import type { GoalKind, Horizon, OnboardingStep } from "@/lib/types";
import { ONBOARDING_ORDER } from "@/lib/types";
import {
  CITY_OPTIONS,
  INDUSTRY_OPTIONS,
  STRENGTH_OPTIONS,
} from "@/content/taxonomy-options";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { Field, Input, Textarea } from "@/components/ui/field";
import { ConceptPicker } from "@/components/ui/concept-picker";
import { ReadinessMeter } from "@/components/ui/states";

/* -------------------------------------------------------------------------- */
/* Draft state                                                                 */
/* -------------------------------------------------------------------------- */

interface NeedDraft {
  id: string;
  kind: GoalKind;
  title: string;
  detail: string;
  horizon: Horizon;
}

interface Draft {
  name: string;
  role: string;
  company: string;
  headline: string;
  industries: readonly string[];
  cities: readonly string[];
  strengths: readonly string[];
  customStrengths: readonly string[];
  needs: readonly NeedDraft[];
  openToDiscovery: boolean;
}

const EMPTY_DRAFT: Draft = {
  name: "",
  role: "",
  company: "",
  headline: "",
  industries: [],
  cities: [],
  strengths: [],
  customStrengths: [],
  needs: [],
  openToDiscovery: true,
};

const STEP_TITLES: Record<Exclude<OnboardingStep, "complete">, string> = {
  identity: "خودت را معرفی کن",
  strengths: "در چه چیزی می‌توانی به بقیه کمک کنی؟",
  needs: "الان دنبال چه فرصتی هستی؟",
  preferences: "ترجیح‌ها و محدودیت‌ها",
  review: "یک مرور آخر",
};

/**
 * Estimated match readiness from the draft.
 *
 * Weighted by what actually drives matching rather than by fields filled: a
 * specific need is worth more than a job title, and a need with no detail is
 * worth less than one with it. Kept in the client so the meter reacts as the
 * member types — the authoritative score comes from the backend.
 */
function estimateReadiness(draft: Draft): number {
  let score = 0;
  if (draft.name.trim()) score += 6;
  if (draft.role.trim()) score += 6;
  if (draft.company.trim()) score += 4;
  if (draft.headline.trim().length > 20) score += 8;
  if (draft.industries.length > 0) score += 6;

  const strengthCount = draft.strengths.length + draft.customStrengths.length;
  score += Math.min(strengthCount, 3) * 8;

  for (const need of draft.needs.slice(0, 3)) {
    score += 10;
    if (need.detail.trim().length > 15) score += 5;
  }

  return Math.min(100, score);
}

/**
 * Progressive onboarding.
 *
 * Five short steps instead of one long form. The needs step is treated as the
 * most important moment in the product — it gets the most guidance, an example
 * of a weak answer next to a strong one, and it is the only step that cannot
 * be skipped, because a profile with no need cannot be matched at all.
 */
export function OnboardingFlow() {
  const [index, setIndex] = React.useState(0);
  const [draft, setDraft] = React.useState<Draft>(EMPTY_DRAFT);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const started = React.useRef(false);

  const step = ONBOARDING_ORDER[index] ?? "identity";
  const readiness = estimateReadiness(draft);

  React.useEffect(() => {
    if (!started.current) {
      started.current = true;
      track({ name: "profile_started" });
    }
  }, []);

  // Move focus to the new step's heading so keyboard and screen-reader users
  // land in the right place instead of at the top of the document.
  React.useEffect(() => {
    headingRef.current?.focus();
  }, [index]);

  function update(patch: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function next() {
    track({ name: "onboarding_step_completed", step });
    if (index < ONBOARDING_ORDER.length - 1) {
      setIndex(index + 1);
    } else {
      track({ name: "profile_completed", readiness });
    }
  }

  const canAdvance =
    step === "identity"
      ? draft.name.trim().length > 1 && draft.role.trim().length > 1
      : step === "strengths"
        ? draft.strengths.length + draft.customStrengths.length > 0
        : step === "needs"
          ? draft.needs.length > 0
          : true;

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator current={index} />

      <div>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="t-h1 text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
        >
          {STEP_TITLES[step as Exclude<OnboardingStep, "complete">]}
        </h1>
      </div>

      <Card padding="lg">
        {step === "identity" && <IdentityStep draft={draft} update={update} />}
        {step === "strengths" && <StrengthsStep draft={draft} update={update} />}
        {step === "needs" && <NeedsStep draft={draft} update={update} />}
        {step === "preferences" && <PreferencesStep draft={draft} update={update} />}
        {step === "review" && <ReviewStep draft={draft} readiness={readiness} />}
      </Card>

      {step !== "identity" && (
        <ReadinessMeter
          score={readiness}
          caption="هر چه نیازها و توانمندی‌هایت مشخص‌تر باشد، پیشنهادها مرتبط‌تر می‌شوند."
        />
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
        >
          <ArrowRight className="size-4" aria-hidden />
          مرحلهٔ قبل
        </Button>

        {step === "review" ? (
          <ButtonLink href="/app" size="lg" onClick={() => track({ name: "profile_completed", readiness })}>
            پایان و رفتن به خانه
          </ButtonLink>
        ) : (
          <Button size="lg" onClick={next} disabled={!canAdvance}>
            ادامه
            <ArrowLeft className="size-4" aria-hidden />
          </Button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Steps                                                                       */
/* -------------------------------------------------------------------------- */

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="مراحل ساخت پروفایل">
      {ONBOARDING_ORDER.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step} className="flex flex-1 items-center gap-2">
            <span
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-semibold",
                done && "bg-brand text-on-brand",
                active && "border-2 border-brand bg-brand-subtle text-brand",
                !done && !active && "border border-line-strong bg-surface text-faint",
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden /> : faDigits(index + 1)}
            </span>
            {index < ONBOARDING_ORDER.length - 1 && (
              <span
                aria-hidden
                className={cn("h-px flex-1", done ? "bg-brand" : "bg-line")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function IdentityStep({
  draft,
  update,
}: {
  draft: Draft;
  update: (patch: Partial<Draft>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Field id="name" label="نام و نام خانوادگی">
        <Input
          id="name"
          value={draft.name}
          autoComplete="name"
          onChange={(event) => update({ name: event.target.value })}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="role" label="سمت">
          <Input
            id="role"
            value={draft.role}
            placeholder="مثلاً بنیان‌گذار"
            onChange={(event) => update({ role: event.target.value })}
          />
        </Field>
        <Field id="company" label="شرکت" optional>
          <Input
            id="company"
            value={draft.company}
            onChange={(event) => update({ company: event.target.value })}
          />
        </Field>
      </div>

      <Field
        id="headline"
        label="در یک جمله بگو روی چه کار می‌کنی"
        hint="این جمله اولین چیزی است که طرف مقابل از تو می‌بیند."
      >
        <Textarea
          id="headline"
          rows={3}
          value={draft.headline}
          placeholder="مثلاً: محصولی برای مدیریت زنجیرهٔ تأمین شرکت‌های پخش می‌سازم."
          onChange={(event) => update({ headline: event.target.value })}
        />
      </Field>

      <Field
        id="industries"
        label="حوزهٔ فعالیت"
        hint="برای پیدا کردن آدم‌های هم‌صنعت استفاده می‌شود."
      >
        <ConceptPicker
          id="industries"
          options={INDUSTRY_OPTIONS}
          selected={draft.industries}
          onChange={(industries) => update({ industries })}
          max={3}
          placeholder="حوزه‌ات را پیدا کن…"
        />
      </Field>
    </div>
  );
}

function StrengthsStep({
  draft,
  update,
}: {
  draft: Draft;
  update: (patch: Partial<Draft>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="t-body text-muted">
        این بخش تعیین می‌کند چه کسانی به تو پیشنهاد می‌شوند. هر چیزی که واقعاً می‌توانی برایش
        وقت بگذاری را انتخاب کن — نه هر چیزی که بلدی.
      </p>

      <ConceptPicker
        id="strengths"
        options={STRENGTH_OPTIONS}
        selected={draft.strengths}
        onChange={(strengths) => {
          const added = strengths.filter((id) => !draft.strengths.includes(id));
          for (const conceptId of added) track({ name: "strength_added", conceptId });
          update({ strengths });
        }}
        custom={draft.customStrengths}
        onCustomChange={(customStrengths) => {
          if (customStrengths.length > draft.customStrengths.length) {
            track({ name: "strength_added" });
          }
          update({ customStrengths });
        }}
        max={6}
        placeholder="مثلاً فروش سازمانی…"
      />
    </div>
  );
}

function NeedsStep({
  draft,
  update,
}: {
  draft: Draft;
  update: (patch: Partial<Draft>) => void;
}) {
  const [kind, setKind] = React.useState<GoalKind>("customers");
  const [title, setTitle] = React.useState("");
  const [detail, setDetail] = React.useState("");
  const [horizon, setHorizon] = React.useState<Horizon>("now");

  function add() {
    if (title.trim().length < 3) return;
    const need: NeedDraft = {
      id: `${Date.now()}`,
      kind,
      title: title.trim(),
      detail: detail.trim(),
      horizon,
    };
    update({ needs: [...draft.needs, need] });
    track({ name: "need_added", kind });
    setTitle("");
    setDetail("");
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="t-body text-muted">
        این مهم‌ترین بخش پروفایل توست. پیشنهادها از روی همین ساخته می‌شوند.
      </p>

      {/* Showing a weak answer beside a strong one teaches specificity far
          faster than an instruction to "be specific" does. */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface-muted/60 p-3">
          <p className="t-overline text-muted">کم‌فایده</p>
          <p className="t-small mt-1 text-muted">«دنبال مشتری‌ام»</p>
        </div>
        <div className="rounded-lg border border-brand-border bg-brand-subtle/60 p-3">
          <p className="t-overline text-brand">قابل استفاده</p>
          <p className="t-small mt-1 text-ink">
            «دنبال پنج شرکت پخش با بیش از پنجاه نیروی فروش میدانی‌ام»
          </p>
        </div>
      </div>

      {draft.needs.length > 0 && (
        <ul className="flex flex-col gap-2" aria-label="نیازهای ثبت‌شده">
          {draft.needs.map((need) => (
            <li
              key={need.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-line p-3"
            >
              <div className="min-w-0">
                <p className="t-label text-ink">{need.title}</p>
                <p className="t-caption mt-0.5 text-muted">
                  {GOAL_LABELS[need.kind]} — {HORIZON_LABELS[need.horizon]}
                </p>
                {need.detail && <p className="t-caption mt-1 text-muted">{need.detail}</p>}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => update({ needs: draft.needs.filter((n) => n.id !== need.id) })}
              >
                حذف
              </Button>
            </li>
          ))}
        </ul>
      )}

      <fieldset className="flex flex-col gap-4 rounded-lg border border-line p-4">
        <legend className="t-label px-1 text-ink">افزودن نیاز</legend>

        <Field id="need-kind" label="دنبال چه هستی؟">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(GOAL_LABELS) as GoalKind[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={kind === option}
                onClick={() => setKind(option)}
                className={cn(
                  "h-9 rounded-md border px-3 text-[0.8125rem] transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  kind === option
                    ? "border-brand bg-brand text-on-brand"
                    : "border-line-strong bg-surface text-muted hover:text-ink",
                )}
              >
                {GOAL_LABELS[option]}
              </button>
            ))}
          </div>
        </Field>

        <Field
          id="need-title"
          label="دقیق‌تر بگو"
          hint="هر چه مشخص‌تر بنویسی، پیشنهادها مرتبط‌تر می‌شوند."
        >
          <Input
            id="need-title"
            value={title}
            placeholder="مثلاً پنج شرکت پخش با بیش از پنجاه نیروی فروش"
            onChange={(event) => setTitle(event.target.value)}
          />
        </Field>

        <Field id="need-detail" label="توضیح" optional>
          <Textarea
            id="need-detail"
            rows={2}
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
          />
        </Field>

        <Field id="need-horizon" label="چقدر فوری است؟">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(HORIZON_LABELS) as Horizon[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={horizon === option}
                onClick={() => setHorizon(option)}
                className={cn(
                  "h-9 rounded-md border px-3 text-[0.8125rem] transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  horizon === option
                    ? "border-brand bg-brand text-on-brand"
                    : "border-line-strong bg-surface text-muted hover:text-ink",
                )}
              >
                {HORIZON_LABELS[option]}
              </button>
            ))}
          </div>
        </Field>

        <div>
          <Button variant="secondary" onClick={add} disabled={title.trim().length < 3}>
            افزودن این نیاز
          </Button>
        </div>
      </fieldset>
    </div>
  );
}

function PreferencesStep({
  draft,
  update,
}: {
  draft: Draft;
  update: (patch: Partial<Draft>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Field
        id="cities"
        label="در کدام شهرها آمادهٔ گفت‌وگو هستی؟"
        hint="خالی گذاشتن یعنی محدودیت شهری نداری."
      >
        <ConceptPicker
          id="cities"
          options={CITY_OPTIONS}
          selected={draft.cities}
          onChange={(cities) => update({ cities })}
          max={4}
          placeholder="شهر را پیدا کن…"
        />
      </Field>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line p-4 transition-colors hover:bg-surface-muted">
        <input
          type="checkbox"
          checked={draft.openToDiscovery}
          onChange={(event) => update({ openToDiscovery: event.target.checked })}
          className="mt-1 size-4 accent-[var(--mj-brand)]"
        />
        <span className="min-w-0">
          <span className="t-label block text-ink">
            پیشنهادهای خارج از نیازهای فعلی‌ام را هم ببینم
          </span>
          <span className="t-caption mt-0.5 block text-muted">
            گاهی فرصت مرتبطی پیدا می‌شود که در فهرست نیازهایت نیست. با خاموش‌کردن این گزینه فقط
            پیشنهادهای منطبق با نیازهای ثبت‌شده را می‌بینی.
          </span>
        </span>
      </label>
    </div>
  );
}

function ReviewStep({ draft, readiness }: { draft: Draft; readiness: number }) {
  const strengthCount = draft.strengths.length + draft.customStrengths.length;

  return (
    <div className="flex flex-col gap-5">
      <p className="t-body text-muted">
        این چیزی است که منجنیق برای ساخت پیشنهاد از آن استفاده می‌کند. هر بخشی را بعداً هم
        می‌توانی تغییر بدهی.
      </p>

      <dl className="flex flex-col gap-4">
        <ReviewRow label="معرفی">
          {draft.name || "—"}
          {draft.role && ` — ${draft.role}`}
          {draft.company && `، ${draft.company}`}
        </ReviewRow>
        <ReviewRow label="توانمندی‌ها">
          {strengthCount > 0 ? `${faDigits(strengthCount)} مورد ثبت شده` : "ثبت نشده"}
        </ReviewRow>
        <ReviewRow label="نیازها">
          {draft.needs.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {draft.needs.map((need) => (
                <li key={need.id}>
                  {need.title}{" "}
                  <span className="text-muted">({GOAL_LABELS[need.kind]})</span>
                </li>
              ))}
            </ul>
          ) : (
            "ثبت نشده"
          )}
        </ReviewRow>
      </dl>

      {readiness < 70 && (
        <p className="t-small rounded-md bg-warning-subtle px-3 py-2 text-warning">
          با مشخص‌کردن دقیق‌تر نیازهایت، پیشنهادهای مرتبط‌تری دریافت می‌کنی.
        </p>
      )}
    </div>
  );
}

function ReviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line pb-3 last:border-0">
      <dt className="t-caption text-muted">{label}</dt>
      <dd className="t-body mt-1 text-ink">{children}</dd>
    </div>
  );
}
