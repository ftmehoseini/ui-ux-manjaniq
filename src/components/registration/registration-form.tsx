"use client";

import * as React from "react";
import { ArrowLeft, CircleAlert, Phone, User } from "lucide-react";
import { EventHeader } from "./event-header";
import { InputField } from "./input-field";
import { PrimaryButton } from "./primary-button";
import { TicketPrice } from "./ticket-price";
import type { RegistrationEventView } from "./event-view";
import type { RegistrationFieldErrors, RegistrationInput } from "./validation";
import type { EventState } from "@/lib/types";

/** Why the form is closed. `null` means registration is open. */
const CLOSED_REASON: Partial<Record<EventState, string>> = {
  announced: "ثبت‌نام این رویداد هنوز باز نشده است.",
  sold_out: "ظرفیت این رویداد تکمیل شده است.",
  live: "این رویداد در حال برگزاری است و ثبت‌نام بسته شده.",
  past: "این رویداد برگزار شده است.",
};

export function RegistrationForm({
  event,
  values,
  errors,
  serverError,
  submitting,
  onChange,
  onSubmit,
}: {
  event: RegistrationEventView;
  values: RegistrationInput;
  errors: RegistrationFieldErrors;
  /** A failure that came back from the API rather than from the fields. */
  serverError: string | null;
  submitting: boolean;
  onChange: (patch: Partial<RegistrationInput>) => void;
  onSubmit: () => void;
}) {
  const closedReason = CLOSED_REASON[event.state] ?? null;
  const disabled = submitting || closedReason !== null;

  return (
    <form
      noValidate
      onSubmit={(formEvent) => {
        formEvent.preventDefault();
        onSubmit();
      }}
      className="flex flex-col"
    >
      <EventHeader
        title={event.title}
        {...(event.edition ? { edition: event.edition } : {})}
        subtitle="جهت ثبت‌نام اطلاعات خود را وارد کنید"
      />

      <div className="mt-7 flex flex-col gap-5">
        <InputField
          id="registration-full-name"
          name="fullName"
          label="نام و نام خانوادگی"
          placeholder="مثال: علی رضایی"
          autoComplete="name"
          enterKeyHint="next"
          icon={<User className="size-5" aria-hidden />}
          value={values.fullName}
          disabled={disabled}
          {...(errors.fullName ? { error: errors.fullName } : {})}
          onChange={(changeEvent) => onChange({ fullName: changeEvent.target.value })}
        />

        <InputField
          id="registration-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          label="شماره تماس"
          placeholder="مثال: ۰۹۱۲ ۳۴۵ ۶۷۸۹"
          autoComplete="tel"
          enterKeyHint="done"
          icon={<Phone className="size-5" aria-hidden />}
          value={values.phone}
          disabled={disabled}
          {...(errors.phone ? { error: errors.phone } : {})}
          onChange={(changeEvent) => onChange({ phone: changeEvent.target.value })}
        />
      </div>

      <TicketPrice price={event.priceLabel} className="mt-6" />

      {closedReason && (
        <p className="mt-4 rounded-[var(--ev-radius-field)] bg-[var(--ev-card-soft)] px-4 py-3 text-center text-[0.875rem] text-[var(--ev-muted)]">
          {closedReason}
        </p>
      )}

      {/* Server failures land here rather than on a field: nothing the member
          typed is wrong, so no field is marked invalid. */}
      {serverError && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-[var(--ev-radius-field)] border border-[var(--ev-danger)]/25 bg-[var(--ev-danger-soft)] px-4 py-3 text-[0.875rem] leading-6 text-[var(--ev-danger)]"
        >
          <CircleAlert className="mt-1 size-4 shrink-0" aria-hidden />
          <span>{serverError}</span>
        </p>
      )}

      <PrimaryButton
        loading={submitting}
        disabled={disabled}
        trailingIcon={<ArrowLeft className="size-6" aria-hidden />}
        className="mt-6"
      >
        ثبت نام
      </PrimaryButton>
    </form>
  );
}
