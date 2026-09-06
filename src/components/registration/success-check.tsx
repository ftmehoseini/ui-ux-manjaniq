import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * The confirmation mark.
 *
 * It is drawn, not cropped from artwork, and it is mounted only by the success
 * branch of the panel — there is no prop that makes it appear on a form that
 * has not been submitted, and no state in which a failed registration can
 * render it.
 *
 * On arrival the disc pops from 0.7 to 1 over 300ms, the tick draws itself,
 * and a single halo expands once and stops. Under `prefers-reduced-motion` the
 * halo is not rendered at all and the rest arrives already drawn.
 */
export function SuccessCheck({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-[86px] items-center justify-center", className)}>
      <span
        aria-hidden
        className="animate-ev-halo absolute inset-0 rounded-full bg-[var(--ev-green)]/35"
      />
      <span
        aria-hidden
        className="animate-ev-pop absolute inset-0 rounded-full ring-8 ring-[var(--ev-green)]/12"
      />
      <svg
        viewBox="0 0 64 64"
        role="img"
        aria-label="ثبت‌نام انجام شد"
        className="animate-ev-pop relative size-[68px]"
      >
        <circle cx="32" cy="32" r="30" fill="var(--ev-green)" />
        <path
          d="M19 33.5 L28 42 L45 24"
          fill="none"
          stroke="#fff"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-ev-draw-check"
        />
      </svg>
    </span>
  );
}
