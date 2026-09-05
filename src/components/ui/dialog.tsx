"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "./button";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * `modal` centres a panel; `sheet` slides up from the bottom edge.
   * Sheets are the mobile default because the primary action stays in reach.
   */
  variant?: "modal" | "sheet";
  className?: string;
}

/**
 * Accessible dialog: focus is moved in on open, trapped while open, and
 * returned to the trigger on close. Escape and backdrop click both dismiss.
 * Built directly rather than pulled from a library — the product needs exactly
 * one dialog behaviour and this is smaller than the dependency.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = "modal",
  className,
}: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  React.useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;

      const firstItem = items[0]!;
      const lastItem = items[items.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && active === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && active === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex",
        variant === "modal" ? "items-center justify-center p-4" : "items-end justify-center",
      )}
    >
      <div
        className="absolute inset-0 animate-fade-in bg-overlay"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[88vh] w-full flex-col overflow-hidden bg-surface shadow-lg",
          variant === "modal"
            ? "max-w-lg animate-rise rounded-xl border border-line"
            : "animate-sheet-up rounded-t-2xl sm:max-w-lg sm:rounded-2xl",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="t-h3 text-ink">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="t-caption mt-1 text-muted">
                {description}
              </p>
            )}
          </div>
          <IconButton label="بستن" size="sm" onClick={onClose} className="-me-2">
            <X className="size-4" aria-hidden />
          </IconButton>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-surface-muted/60 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
