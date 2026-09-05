import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * PROVISIONAL MARK — replace with the real Manjaniq logo when it is available.
 *
 * No brand asset existed when this was built. Rather than leave a gap in the
 * header, this draws a minimal figure from the name itself: منجنیق is a
 * catapult, so the mark is a launch arc leaving a base — leverage and
 * trajectory, not a network graph or a glowing orb.
 *
 * It is a single component reading `currentColor`, so swapping in the real
 * artwork means editing this file only.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-7", className)}
    >
      {/* The arc: a launched trajectory. */}
      <path
        d="M3 19C6.5 8.5 13.5 4 21 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* The base it launched from. */}
      <path d="M3 19h5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {/* The payload, at the far end of the arc. */}
      <circle cx="19.5" cy="5.5" r="2.75" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-brand", className)}>
      <LogoMark />
      {showWordmark && (
        <span className="text-lg font-bold tracking-tight text-ink">منجنیق</span>
      )}
    </span>
  );
}
