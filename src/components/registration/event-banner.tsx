import * as React from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The wide key image above the registration card.
 *
 * A real slot, not part of the background: dropping `src` in changes nothing
 * about the layout. Without one it renders a dashed plate rather than a broken
 * image, so an event that has not shipped artwork still composes.
 */
export function EventBanner({
  src,
  alt,
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ev-glass relative w-full overflow-hidden rounded-[1.25rem]",
        "h-[104px] sm:h-[140px] lg:h-[165px]",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          className="size-full object-cover"
          decoding="async"
          fetchPriority="high"
        />
      ) : (
        <div className="absolute inset-2 flex items-center justify-center rounded-[0.9rem] border border-dashed border-white/25">
          <ImageIcon className="size-8 text-white/45" aria-hidden />
          <span className="sr-only">تصویر رویداد هنوز منتشر نشده است</span>
        </div>
      )}
    </div>
  );
}
