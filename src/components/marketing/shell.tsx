import * as React from "react";
import { cn } from "@/lib/cn";
import { faDigits } from "@/lib/format";

/** Page-width container. One value, used everywhere, so gutters never drift. */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export type SectionTone = "paper" | "surface" | "muted" | "deep" | "brand";

export interface SectionProps {
  id?: string;
  tone?: SectionTone;
  /** Vertical rhythm is deliberately uneven — a page where every band is the
   *  same height reads as generated. `tight` and `tall` break the metronome. */
  size?: "tight" | "normal" | "tall";
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
  /** Paper grain. On by default for the dark and brand grounds, where it reads. */
  grain?: boolean;
  bleed?: boolean;
}

const TONES: Record<SectionTone, string> = {
  paper: "",
  surface: "bg-surface",
  muted: "bg-surface-muted",
  deep: "bg-deep text-on-deep",
  brand: "bg-brand text-on-brand",
};

const SIZES = {
  tight: "py-12 sm:py-16",
  normal: "py-16 sm:py-24",
  tall: "py-24 sm:py-36",
} as const;

export function Section({
  id,
  tone = "paper",
  size = "normal",
  className,
  children,
  labelledBy,
  grain,
  bleed = false,
}: SectionProps) {
  const wantsGrain = grain ?? (tone === "deep" || tone === "brand");
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative", TONES[tone], SIZES[size], wantsGrain && "grain", className)}
    >
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}

/**
 * A section headed the way a printed article is: an oversized numeral set in
 * the margin, a rule, then the title. Replaces the centred "overline + heading
 * + subtitle" block that every generated page reaches for.
 */
export function EditorialHead({
  index,
  label,
  title,
  lead,
  id,
  tone = "light",
  action,
  className,
}: {
  /** Section number, rendered in Persian digits. */
  index?: number;
  label?: string;
  title: string;
  lead?: string;
  id?: string;
  tone?: "light" | "deep";
  action?: React.ReactNode;
  className?: string;
}) {
  const onDeep = tone === "deep";
  return (
    <div className={cn("rule-t pt-6", onDeep && "border-t-white/20", className)}>
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 gap-5 sm:gap-8">
          {index !== undefined && (
            <span
              aria-hidden
              className={cn(
                "t-numeral shrink-0 select-none",
                onDeep ? "text-white/15" : "text-ink/10",
              )}
            >
              {faDigits(String(index).padStart(2, "0"))}
            </span>
          )}
          <div className="min-w-0 pt-1">
            {label && (
              <p className={cn("t-overline mb-3", onDeep ? "text-accent-on-deep" : "text-accent")}>
                {label}
              </p>
            )}
            <h2 id={id} className={cn("t-h1 max-w-2xl", onDeep ? "text-on-deep" : "text-ink")}>
              {title}
            </h2>
            {lead && (
              <p
                className={cn(
                  "t-lead mt-5 max-w-prose",
                  onDeep ? "text-on-deep-muted" : "text-muted",
                )}
              >
                {lead}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0 md:pt-2">{action}</div>}
      </div>
    </div>
  );
}

/**
 * The trajectory: a launched arc from a base to a payload.
 *
 * منجنیق is a catapult, and this is the shape the whole identity hangs on — it
 * appears behind the hero, marks the steps, and closes the page. Having one
 * repeating graphic signature is most of the difference between a brand and a
 * theme.
 */
export function TrajectoryArc({
  className,
  animate = false,
  strokeWidth = 1.25,
}: {
  className?: string;
  animate?: boolean;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 800 300"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <path
        d="M20 280 C 180 260, 380 170, 520 90 S 720 20, 780 16"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={animate ? "animate-draw [--mj-arc-length:900]" : undefined}
      />
      <circle cx="20" cy="280" r="4" fill="currentColor" />
      <circle cx="780" cy="16" r="8" fill="currentColor" />
    </svg>
  );
}

/**
 * An image slot.
 *
 * No photography was supplied, so rather than a broken-looking grey box or —
 * worse — stock photos of a "networking event" that never happened, an empty
 * slot renders as a deliberately composed plate: paper ground, brass rule,
 * and a caption naming exactly what belongs there. It reads as art direction
 * awaiting its plate, and drops a real `src` in without any layout change.
 */
export function PhotoFrame({
  src,
  alt,
  caption,
  placeholder,
  ratio = "4 / 3",
  className,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  /** What photograph belongs here. Shown only while `src` is absent. */
  placeholder: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div
        className="relative overflow-hidden rounded-sm bg-surface-muted"
        style={{ aspectRatio: ratio }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt ?? ""} className="size-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <div className="grain absolute inset-0 flex items-end p-5">
            <span
              aria-hidden
              className="absolute inset-x-5 top-5 block h-px bg-accent-border"
            />
            <p className="t-caption relative text-faint">{placeholder}</p>
          </div>
        )}
      </div>
      {caption && <figcaption className="t-caption text-faint">{caption}</figcaption>}
    </figure>
  );
}
