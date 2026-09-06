import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface PrimaryButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  /** Swaps the label for a spinner and blocks further submissions. */
  loading?: boolean;
  loadingLabel?: string;
  /** Rendered at the inline end — the forward arrow of the reference. */
  trailingIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * The stage's primary action.
 *
 * A real `<button>`; the dimensional green treatment lives in `.ev-cta`. While
 * loading it stays disabled and keeps its own width, so the card does not jump
 * between «ثبت نام» and «در حال ثبت…».
 */
export function PrimaryButton({
  loading = false,
  loadingLabel = "در حال ثبت…",
  trailingIcon,
  disabled,
  type = "submit",
  className,
  children,
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      className={cn("ev-cta", className)}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {trailingIcon}
        </>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="size-5 shrink-0 animate-spin rounded-full border-2 border-white/45 border-t-white motion-reduce:animate-none"
    />
  );
}

export interface PrimaryButtonLinkProps
  extends Omit<React.ComponentProps<typeof Link>, "className" | "children"> {
  trailingIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * The same treatment for a destination rather than an action.
 *
 * A link, not a button, because it navigates — the confirmation's «بازگشت به
 * خانه» must be openable in a new tab and must not look like another
 * submission to assistive technology.
 */
export function PrimaryButtonLink({
  trailingIcon,
  className,
  children,
  ...rest
}: PrimaryButtonLinkProps) {
  return (
    <Link {...rest} className={cn("ev-cta", className)}>
      <span>{children}</span>
      {trailingIcon}
    </Link>
  );
}
