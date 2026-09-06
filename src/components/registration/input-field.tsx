import * as React from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "className"> {
  id: string;
  label: string;
  /** Sits at the inline start of the control. Decorative — the label carries the meaning. */
  icon?: React.ReactNode;
  error?: string;
  hint?: string;
  className?: string;
}

/**
 * A labelled control for the registration card.
 *
 * Every state the design needs — default, hover, focus, filled, invalid,
 * disabled — is expressed by `.ev-field` in `globals.css` rather than by a
 * prop, so no call site can ship a field that looks focused but is not.
 *
 * An invalid field is marked three ways at once: `aria-invalid`, a message
 * wired through `aria-describedby`, and colour. Colour is never the only one.
 */
export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { id, label, icon, error, hint, className, ...rest },
  ref,
) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[0.9375rem] font-semibold text-[var(--ev-ink)]">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-[var(--ev-muted)]"
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
          className={cn("ev-field", icon ? "ps-11" : null)}
        />
      </div>

      {hint && !error && (
        <p id={hintId} className="text-[0.8125rem] leading-6 text-[var(--ev-muted)]">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="flex items-start gap-1.5 text-[0.8125rem] leading-6 text-[var(--ev-danger)]"
        >
          <CircleAlert className="mt-1 size-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});
