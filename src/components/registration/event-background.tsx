import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * The auditorium.
 *
 * A photograph is used when the event supplies one, darkened far enough that
 * white text and a white card stay legible on top of it. When it does not —
 * and no such asset ships with this repository — the ground is composed in
 * CSS: a deep navy base, the cool wash of a lighting rig across the top, a
 * warm centre glow behind the card, and a vignette. It is never a screenshot,
 * and it never carries any of the interface inside it.
 */
export function EventBackground({
  imageUrl,
  className,
}: {
  imageUrl?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("grain absolute inset-0 overflow-hidden bg-[var(--ev-ground-deep)]", className)}
    >
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
          decoding="async"
        />
      )}

      {/* Lighting rig. Sits above the photograph too, which is what keeps a
          bright press image from washing the card out. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            /* Key light over the stage. */
            "radial-gradient(70% 45% at 50% -4%, rgb(58 96 236 / 0.75), transparent 72%)",
            /* Two side lamps in the rig. */
            "radial-gradient(30% 26% at 10% 4%, rgb(116 72 214 / 0.6), transparent 70%)",
            "radial-gradient(28% 24% at 90% 8%, rgb(46 84 220 / 0.65), transparent 70%)",
            /* The lit screen behind the speaker, low and wide. */
            "radial-gradient(48% 30% at 50% 34%, rgb(40 62 160 / 0.45), transparent 75%)",
            /* House glow off the seating, so the lower half is not a void. */
            "radial-gradient(90% 50% at 50% 96%, rgb(26 34 96 / 0.55), transparent 70%)",
          ].join(","),
        }}
      />

      {/* Darkening pass + vignette: contrast for everything above it. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(180deg, rgb(3 4 15 / 0.5) 0%, rgb(5 6 26 / 0.34) 38%, rgb(3 4 15 / 0.72) 100%)",
            "radial-gradient(120% 85% at 50% 42%, transparent 42%, rgb(3 4 15 / 0.7) 100%)",
          ].join(","),
        }}
      />
    </div>
  );
}
