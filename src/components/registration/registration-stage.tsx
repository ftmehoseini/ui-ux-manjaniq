"use client";

import * as React from "react";
import { getApi } from "@/lib/api";
import { ApiNotConfiguredError, ApiRequestError } from "@/lib/api/client";
import { track } from "@/lib/analytics";
import { EventHeader } from "./event-header";
import { RegistrationPanel, type PanelState } from "./registration-panel";
import { normalisePhone, validateRegistration } from "./validation";
import type { RegistrationFieldErrors, RegistrationInput } from "./validation";
import type { RegistrationEventView } from "./event-view";

/**
 * Turns a thrown value into something a member can act on. The server's own
 * message is never shown verbatim — it is written for an operator.
 */
function messageFor(error: unknown): string {
  if (error instanceof ApiNotConfiguredError) {
    return "ارتباط با سرور برقرار نیست. لطفاً چند لحظه بعد دوباره تلاش کنید.";
  }
  if (error instanceof ApiRequestError) {
    if (error.status === 409) return "ظرفیت این رویداد همین حالا تکمیل شد.";
    if (error.status === 422 || error.status === 400) {
      return "اطلاعات واردشده پذیرفته نشد. شماره تماس و نام را بررسی کنید.";
    }
    if (error.status === 429) return "تعداد تلاش‌ها زیاد بود. کمی بعد دوباره تلاش کنید.";
    if (error.status >= 500) return "سرور پاسخ نداد. چند لحظه بعد دوباره تلاش کنید.";
  }
  return "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.";
}

/**
 * The registration flow.
 *
 * It holds the state machine and the one call that can declare a registration
 * successful, which is why it — rather than the card — also renders the parts
 * of the stage that answer to that state: the masthead over the banner appears
 * with the confirmation, where the card's own heading has become the member's
 * name.
 *
 * `banner` is passed in rather than rendered here so the image stays a server
 * component: nothing about it depends on client state.
 */
export function RegistrationStage({
  event,
  banner,
  backLink,
}: {
  event: RegistrationEventView;
  banner: React.ReactNode;
  /** Sits opposite the masthead in the top row — the way back out of the flow. */
  backLink?: React.ReactNode;
}) {
  const [state, setState] = React.useState<PanelState>({ status: "form" });
  const [values, setValues] = React.useState<RegistrationInput>({ fullName: "", phone: "" });
  const [errors, setErrors] = React.useState<RegistrationFieldErrors>({});

  React.useEffect(() => {
    track({ name: "registration_started", eventSlug: event.slug });
  }, [event.slug]);

  function change(patch: Partial<RegistrationInput>): void {
    setValues((current) => ({ ...current, ...patch }));
    // Clear a field's error as soon as it is edited: keeping it visible while
    // the member fixes it reads as the fix not having worked.
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof RegistrationInput)[]) delete next[key];
      return next;
    });
    setState((current) => (current.status === "error" ? { status: "form" } : current));
  }

  async function submit(): Promise<void> {
    if (state.status === "submitting") return;

    const fieldErrors = validateRegistration(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setState({ status: "form" });
      // Put the caret on the first problem rather than leaving the member to
      // hunt for the red text.
      const firstInvalid = fieldErrors.fullName ? "registration-full-name" : "registration-phone";
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    const phone = normalisePhone(values.phone);
    if (phone === null) return;

    setErrors({});
    setState({ status: "submitting" });

    try {
      const receipt = await getApi().registerForEvent({
        eventSlug: event.slug,
        fullName: values.fullName.trim(),
        phone,
        quantity: 1,
      });
      track({ name: "registration_completed", eventSlug: event.slug });
      setState({ status: "success", receipt });
    } catch (error) {
      setState({ status: "error", message: messageFor(error) });
    }
  }

  return (
    <>
      <div className="flex w-full shrink-0 items-start justify-between gap-4">
        {state.status === "success" ? (
          <EventHeader
            variant="stage"
            title={event.title}
            {...(event.edition ? { edition: event.edition } : {})}
            className="animate-ev-state-in"
          />
        ) : (
          <span />
        )}
        {backLink}
      </div>

      {/* Banner and card are one centred group; the information bar keeps to
          the foot of the stage when the viewport is taller than they are. */}
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 sm:gap-8">
        {banner}
        <RegistrationPanel
          event={event}
          state={state}
          values={values}
          errors={errors}
          onChange={change}
          onSubmit={() => void submit()}
          className="max-w-[34.5rem]"
        />
      </div>
    </>
  );
}
