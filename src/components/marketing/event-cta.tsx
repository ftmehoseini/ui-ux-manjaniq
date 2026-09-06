"use client";

import * as React from "react";
import { track } from "@/lib/analytics";
import type { EventState } from "@/lib/types";
import { Card } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/button";

/**
 * The registration panel.
 *
 * It states the price before asking for anything and says plainly that paying
 * is not the same as being accepted — the product selects participants, and a
 * member who discovers that after paying has been misled by the interface.
 */
export function EventRegistrationCta({
  slug,
  state,
  priceLabel,
  registrationUrl,
}: {
  slug: string;
  state: EventState;
  priceLabel: string | null;
  registrationUrl: string | null;
}) {
  React.useEffect(() => {
    track({ name: "event_viewed", eventSlug: slug });
  }, [slug]);

  const open = state === "open";

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      {priceLabel ? (
        <div>
          <p className="t-caption text-muted">هزینهٔ شرکت</p>
          <p className="text-2xl font-semibold text-ink">{priceLabel}</p>
        </div>
      ) : (
        <p className="t-small text-muted">هزینهٔ شرکت هنوز اعلام نشده است.</p>
      )}

      {open ? (
        /* An external destination still wins when the event declares one;
           otherwise registration happens in-product on the event stage. The
           handoff is tracked here only in the external case — the in-product
           panel records the funnel start itself when it mounts. */
        <ButtonLink
          href={registrationUrl ?? `/events/${slug}/register`}
          size="lg"
          block
          onClick={
            registrationUrl
              ? () => track({ name: "registration_started", eventSlug: slug })
              : undefined
          }
        >
          درخواست شرکت
        </ButtonLink>
      ) : (
        <Button size="lg" block disabled>
          {state === "sold_out" ? "ظرفیت تکمیل است" : "ثبت‌نام هنوز باز نشده"}
        </Button>
      )}

      <p className="t-caption text-muted">
        ثبت درخواست به معنی تأیید حضور نیست. هر درخواست بر اساس نیاز و توانمندی ثبت‌شده بررسی
        می‌شود و نتیجه به تو اعلام می‌شود.
      </p>
    </Card>
  );
}
