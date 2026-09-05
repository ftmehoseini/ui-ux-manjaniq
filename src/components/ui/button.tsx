import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium " +
  "transition-colors duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
  "disabled:pointer-events-none disabled:opacity-45 " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-45";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brand text-on-brand hover:bg-brand-hover active:bg-brand-active shadow-sm",
  secondary:
    "bg-surface text-ink border border-line-strong hover:bg-surface-muted active:bg-surface-muted",
  ghost: "bg-transparent text-ink hover:bg-surface-muted",
  danger: "bg-danger text-white hover:opacity-90",
  link: "bg-transparent text-brand underline underline-offset-4 hover:text-brand-hover px-0",
};

/** Minimum 44px touch target at `md` and above; `sm` is for dense desktop rows. */
const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-[0.8125rem]",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-[0.9375rem]",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretches to the container. Used for mobile-width primary actions. */
  block?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface ButtonProps
  extends CommonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> {
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      className={cn(
        BASE,
        VARIANTS[variant],
        SIZES[size],
        block && "w-full",
        variant !== "link" && "min-w-[2.75rem]",
        className,
      )}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export interface ButtonLinkProps
  extends CommonProps,
    Omit<React.ComponentProps<typeof Link>, "children" | "className"> {}

/** A link that reads as a button. Use for navigation; `Button` is for actions. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  block = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      {...rest}
      className={cn(BASE, VARIANTS[variant], SIZES[size], block && "w-full", className)}
    >
      {children}
    </Link>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
    />
  );
}

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  /** Required: an icon alone conveys nothing to a screen reader. */
  label: string;
  variant?: Extract<ButtonVariant, "secondary" | "ghost">;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

export function IconButton({
  label,
  variant = "ghost",
  size = "md",
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={cn(
        BASE,
        VARIANTS[variant],
        size === "sm" ? "size-9" : "size-11",
        "shrink-0 p-0",
        className,
      )}
    >
      {children}
    </button>
  );
}
