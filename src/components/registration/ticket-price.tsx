import * as React from "react";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The price, stated before the member is asked for anything.
 *
 * `price` is a formatted label from event data — this component never knows a
 * currency or an amount. When the organiser has not published a price it says
 * so rather than showing an empty box or an invented number.
 */
export function TicketPrice({
  price,
  label = "بهای هر بلیت",
  className,
}: {
  price: string | null;
  label?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center justify-center gap-2.5 rounded-[var(--ev-radius-field)] bg-[var(--ev-card-soft)] px-4 py-3.5 text-center",
        className,
      )}
    >
      <Ticket className="size-5 shrink-0 text-[var(--ev-ink)]" aria-hidden />
      {price ? (
        <>
          <span className="text-[0.9375rem] text-[var(--ev-muted)]">{label}</span>
          <span className="text-[1.0625rem] font-bold text-[var(--ev-ink)]">{price}</span>
        </>
      ) : (
        <span className="text-[0.9375rem] text-[var(--ev-muted)]">
          بهای بلیت هنوز اعلام نشده است
        </span>
      )}
    </p>
  );
}
