import * as React from "react";
import { cn } from "@/lib/cn";

const CONTROL =
  "w-full rounded-md border border-line-strong bg-surface px-3 text-ink " +
  "placeholder:text-faint transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus " +
  "focus-visible:border-brand " +
  "disabled:bg-surface-muted disabled:text-faint disabled:cursor-not-allowed " +
  "aria-[invalid=true]:border-danger";

interface FieldShellProps {
  id: string;
  label: string;
  /** Explains why the field matters for matching. Kept short. */
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Label + control + hint/error, wired with the right `aria-describedby`.
 * Every input in the product goes through this so no field ships unlabelled.
 */
export function Field({
  id,
  label,
  hint,
  error,
  optional = false,
  children,
  className,
}: FieldShellProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="t-label text-ink">
        {label}
        {optional && <span className="t-caption text-faint"> — اختیاری</span>}
      </label>
      {hint && (
        <p id={hintId} className="t-caption text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={errorId} role="alert" className="t-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Builds the describedby string for a control inside `Field`. */
export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} {...rest} className={cn(CONTROL, "h-11", className)} />;
  },
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 4, ...rest }, ref) {
  return <textarea ref={ref} rows={rows} {...rest} className={cn(CONTROL, "py-2.5", className)} />;
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...rest }, ref) {
  return (
    <select ref={ref} {...rest} className={cn(CONTROL, "h-11 appearance-none", className)}>
      {children}
    </select>
  );
});
