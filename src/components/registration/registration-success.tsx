"use client";

import * as React from "react";
import { ArrowLeft, Clock, Ticket } from "lucide-react";
import { faDigits, faEventTime } from "@/lib/format";
import { PrimaryButtonLink } from "./primary-button";
import { SuccessCheck } from "./success-check";
import type { RegistrationEventView } from "./event-view";
import type { EventRegistrationReceipt, RegistrationStatus } from "@/lib/types";

/** The one line that says what actually happened. Never the same for all three. */
function outcomeLine(status: RegistrationStatus, eventName: React.ReactNode): React.ReactNode {
  if (status === "pending_review") {
    return (
      <>
        درخواست شما برای {eventName} ثبت شد و پس از بررسی، نتیجه به شما اعلام می‌شود.
      </>
    );
  }
  if (status === "waitlisted") {
    return (
      <>
        ظرفیت {eventName} تکمیل است و نام شما در فهرست انتظار ثبت شد. اگر جایی آزاد شود خبرتان
        می‌کنیم.
      </>
    );
  }
  return <>ثبت نام شما در {eventName} با موفقیت انجام شد.</>;
}

const TICKET_LABEL: Record<RegistrationStatus, string> = {
  confirmed: "تعداد بلیت خریداری شده",
  pending_review: "تعداد بلیت درخواست‌شده",
  waitlisted: "تعداد بلیت در فهرست انتظار",
};

/**
 * The confirmation.
 *
 * Everything on it comes from the receipt the backend returned — the name, the
 * ticket count and the door time. Nothing is echoed back from the form, so a
 * screen that says «ثبت نام شما … انجام شد» can only exist after a backend
 * actually said so.
 */
export function RegistrationSuccess({
  event,
  receipt,
}: {
  event: RegistrationEventView;
  receipt: EventRegistrationReceipt;
}) {
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  // The panel swapped its contents without a navigation; move focus to the new
  // heading so keyboard and screen-reader users land on the outcome.
  React.useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const arrivalLabel = receipt.arrivalDeadline
    ? faEventTime(receipt.arrivalDeadline)
    : event.arrivalLabel;

  const eventName = (
    <b className="font-bold text-[var(--ev-gold-ink)]">
      {event.title}
      {event.edition ? ` ${event.edition}` : ""}
    </b>
  );

  return (
    <div className="animate-ev-state-in flex flex-col items-center text-center">
      <SuccessCheck />

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-6 font-[family-name:var(--font-display)] text-[clamp(1.625rem,1.2rem+2vw,2.5rem)] font-extrabold leading-tight text-[var(--ev-ink)] outline-none"
      >
        {receipt.fullName} عزیز
      </h1>

      <span aria-hidden className="mt-4 block h-px w-14 bg-[var(--ev-line)]" />

      <p className="mt-4 text-[1.0625rem] leading-8 text-[var(--ev-muted)]">
        {outcomeLine(receipt.status, eventName)}
      </p>

      <dl className="mt-6 flex w-full items-center justify-between gap-4 rounded-[var(--ev-radius-field)] bg-[var(--ev-card-soft)] px-4 py-3.5 sm:px-5">
        <dt className="flex items-center gap-2.5 text-[0.9375rem] text-[var(--ev-muted)]">
          <Ticket className="size-5 shrink-0 text-[var(--ev-ink)]" aria-hidden />
          {TICKET_LABEL[receipt.status]}
        </dt>
        <dd className="border-s border-[var(--ev-line)] ps-4 text-[1.125rem] font-bold text-[var(--ev-ink)]">
          {faDigits(receipt.ticketQuantity)}
        </dd>
      </dl>

      {/* Only rendered when a door time exists. The interface never invents one. */}
      {arrivalLabel && (
        <p className="mt-3 flex w-full items-start gap-2.5 rounded-[var(--ev-radius-field)] bg-[var(--ev-card-soft)] px-4 py-3.5 text-start text-[0.9375rem] leading-7 text-[var(--ev-muted)] sm:px-5">
          <Clock className="mt-1 size-5 shrink-0 text-[var(--ev-ink)]" aria-hidden />
          <span>
            لطفاً جهت حفظ نظم، حداکثر تا{" "}
            <b className="font-bold whitespace-nowrap text-[var(--ev-gold-ink)]">
              ساعت {arrivalLabel}
            </b> در محل سالن
            حضور داشته باشید.
          </span>
        </p>
      )}

      <PrimaryButtonLink
        href="/"
        trailingIcon={<ArrowLeft className="size-6" aria-hidden />}
        className="mt-6"
      >
        بازگشت به خانه
      </PrimaryButtonLink>
    </div>
  );
}
