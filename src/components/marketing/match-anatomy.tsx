import * as React from "react";
import { ArrowDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The anatomy of a match explanation, shown at size on the homepage.
 *
 * This is a specimen, not a screenshot and not a mock profile: the content
 * slots are drawn as rules rather than filled with an invented person, which
 * keeps the page honest while still showing the reader the actual shape of
 * what they will get. Both columns must be full for a match to exist, and the
 * layout makes that structural rather than stated.
 */
export function MatchAnatomy({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-sm border border-line bg-surface p-5 sm:p-7", className)}>
      <p className="t-overline text-muted">ساختار توضیح هر پیشنهاد</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Leg
          tone="brand"
          topLabel="تو دنبال این هستی"
          bottomLabel="او می‌تواند اینجا کمک کند"
        />
        <Leg tone="neutral" topLabel="او دنبال این است" bottomLabel="تو می‌توانی اینجا کمک کنی" />
      </div>

      <p className="rule-t mt-6 flex items-center gap-2 pt-4 text-success">
        <Check className="size-4" aria-hidden />
        <span className="t-small">
          هر دو ستون پر است — این یعنی یک پیشنهاد واقعی.
        </span>
      </p>
      <p className="t-caption mt-2 text-faint">
        اگر یکی از ستون‌ها خالی بماند، منجنیق پیشنهادی نمی‌سازد.
      </p>
    </div>
  );
}

function Leg({
  topLabel,
  bottomLabel,
  tone,
}: {
  topLabel: string;
  bottomLabel: string;
  tone: "brand" | "neutral";
}) {
  return (
    <div
      className={cn(
        "rounded-sm border p-4",
        tone === "brand" ? "border-brand-border bg-brand-subtle/60" : "border-line bg-surface-muted/70",
      )}
    >
      <p className="t-overline text-muted">{topLabel}</p>
      <Slots widths={["85%", "60%"]} />
      <ArrowDown className="my-4 size-4 text-faint" aria-hidden />
      <p className="t-overline text-muted">{bottomLabel}</p>
      <Slots widths={["70%", "45%"]} />
    </div>
  );
}

/** Content placeholders drawn as typographic rules. */
function Slots({ widths }: { widths: readonly string[] }) {
  return (
    <div className="mt-3 flex flex-col gap-2" aria-hidden>
      {widths.map((width) => (
        <span key={width} className="block h-2 rounded-full bg-ink/10" style={{ inlineSize: width }} />
      ))}
    </div>
  );
}
