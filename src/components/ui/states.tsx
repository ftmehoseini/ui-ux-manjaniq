import * as React from "react";
import { cn } from "@/lib/cn";
import { faPercent } from "@/lib/format";

/* -------------------------------------------------------------------------- */
/* EmptyState                                                                  */
/* -------------------------------------------------------------------------- */

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  /**
   * Why the view is empty and what changes it. Never "چیزی یافت نشد." — an
   * empty state is the product's best chance to explain how matching works.
   */
  description: string;
  action?: React.ReactNode;
  className?: string;
  tone?: "default" | "bare";
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = "default",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-12 text-center",
        tone === "default" && "rounded-xl border border-dashed border-line-strong bg-surface-muted/50",
        className,
      )}
    >
      {icon && <span className="text-faint">{icon}</span>}
      <h3 className="t-h3 text-ink">{title}</h3>
      <p className="t-small max-w-measure text-muted">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ErrorState                                                                  */
/* -------------------------------------------------------------------------- */

export interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = "اطلاعات بارگذاری نشد",
  description = "ارتباط با سرور برقرار نشد. چند لحظه بعد دوباره تلاش کن.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-line bg-danger-subtle px-6 py-10 text-center",
        className,
      )}
    >
      <h3 className="t-h3 text-ink">{title}</h3>
      <p className="t-small max-w-measure text-muted">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Readiness meter                                                             */
/* -------------------------------------------------------------------------- */

export interface ReadinessMeterProps {
  score: number;
  /** Shown beside the number so the figure is never bare. */
  caption?: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Profile quality, expressed as a bar with a mandatory caption.
 *
 * This is not a form-completion percentage: the caller passes a score weighted
 * by matching impact, and the caption states what the number means. The
 * component refuses to render a naked figure.
 */
export function ReadinessMeter({ score, caption, size = "md", className }: ReadinessMeterProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const tone = clamped >= 75 ? "bg-success" : clamped >= 45 ? "bg-accent" : "bg-warning";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className={cn("text-ink", size === "md" ? "t-label" : "t-caption")}>
          کیفیت پروفایل برای پیشنهادهای منجنیق
        </span>
        <span className={cn("font-semibold text-ink", size === "md" ? "text-base" : "text-sm")}>
          {faPercent(clamped)}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="کیفیت پروفایل برای پیشنهادهای منجنیق"
        className={cn("w-full overflow-hidden rounded-full bg-surface-muted", size === "md" ? "h-2" : "h-1.5")}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none", tone)}
          style={{ inlineSize: `${clamped}%` }}
        />
      </div>
      {caption && <p className="t-caption text-muted">{caption}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Metric                                                                      */
/* -------------------------------------------------------------------------- */

export interface MetricProps {
  label: string;
  value: string;
  /** Says what the number is for. A metric without meaning is a vanity metric. */
  meaning?: string;
  className?: string;
}

export function Metric({ label, value, meaning, className }: MetricProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="t-caption text-muted">{label}</span>
      <span className="text-2xl font-semibold leading-tight text-ink">{value}</span>
      {meaning && <span className="t-caption text-faint">{meaning}</span>}
    </div>
  );
}
