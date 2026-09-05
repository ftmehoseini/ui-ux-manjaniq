import * as React from "react";
import { cn } from "@/lib/cn";
import { initials as toInitials } from "@/lib/format";

/* -------------------------------------------------------------------------- */
/* Card                                                                        */
/* -------------------------------------------------------------------------- */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `raised` adds hover elevation; use only when the whole card is clickable. */
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const CARD_PADDING = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-7",
} as const;

export function Card({
  interactive = false,
  padding = "md",
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-xl border border-line bg-surface",
        CARD_PADDING[padding],
        interactive &&
          "transition-shadow duration-200 hover:shadow-md focus-within:shadow-md motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Badge / Tag / FilterChip                                                    */
/* -------------------------------------------------------------------------- */

export type BadgeTone =
  | "neutral"
  | "brand"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "bg-surface-muted text-muted border-line",
  brand: "bg-brand-subtle text-brand border-brand-border",
  accent: "bg-accent-subtle text-accent border-accent-border",
  success: "bg-success-subtle text-success border-transparent",
  warning: "bg-warning-subtle text-warning border-transparent",
  danger: "bg-danger-subtle text-danger border-transparent",
  info: "bg-info-subtle text-info border-transparent",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: React.ReactNode;
}

export function Badge({ tone = "neutral", icon, className, children, ...rest }: BadgeProps) {
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[0.75rem] font-medium leading-6",
        BADGE_TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/** A read-only concept chip — a need, a strength, an industry. */
export function Tag({ className, children, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center rounded-md bg-surface-muted px-2.5 py-1 text-[0.8125rem] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface FilterChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  selected: boolean;
  className?: string;
}

/** Toggleable filter. Uses `aria-pressed` so state is announced, not just coloured. */
export function FilterChip({ selected, className, children, ...rest }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      {...rest}
      className={cn(
        "inline-flex h-9 shrink-0 items-center rounded-md border px-3 text-[0.8125rem] font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        selected
          ? "border-brand bg-brand text-on-brand"
          : "border-line-strong bg-surface text-muted hover:bg-surface-muted hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                      */
/* -------------------------------------------------------------------------- */

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const AVATAR_SIZES = {
  sm: "size-9 text-[0.8125rem]",
  md: "size-12 text-sm",
  lg: "size-16 text-base",
} as const;

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full",
        "border border-line bg-brand-subtle font-medium text-brand",
        AVATAR_SIZES[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" loading="lazy" decoding="async" />
      ) : (
        <span aria-hidden>{toInitials(name)}</span>
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* SectionHeader                                                               */
/* -------------------------------------------------------------------------- */

export interface SectionHeaderProps {
  /** Small label above the title. Used to name the section, not to shout. */
  overline?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  as?: "h2" | "h3";
  className?: string;
  align?: "start" | "center";
}

export function SectionHeader({
  overline,
  title,
  description,
  action,
  as: Heading = "h2",
  align = "start",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center",
        className,
      )}
    >
      <div className={cn("max-w-prose", align === "center" && "text-center")}>
        {overline && <p className="t-overline mb-2 text-brand">{overline}</p>}
        <Heading className={Heading === "h2" ? "t-h2 text-ink" : "t-h3 text-ink"}>{title}</Heading>
        {description && <p className="t-body mt-2 text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                    */
/* -------------------------------------------------------------------------- */

export function Skeleton({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      {...rest}
      className={cn(
        "rounded-md bg-surface-muted",
        "bg-[linear-gradient(90deg,transparent,rgb(0_0_0/0.04),transparent)] bg-[length:200%_100%]",
        "motion-safe:animate-[mj-shimmer_1.4s_ease-in-out_infinite]",
        className,
      )}
    />
  );
}

/** Announces that content is loading, for assistive technology. */
export function LoadingRegion({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
