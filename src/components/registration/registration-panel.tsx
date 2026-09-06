"use client";

import * as React from "react";
import { getApi } from "@/lib/api";
import { ApiNotConfiguredError, ApiRequestError } from "@/lib/api/client";
import { track } from "@/lib/analytics";
import type { EventRegistrationReceipt } from "@/lib/types";
import { RegistrationForm } from "./registration-form";
import { RegistrationSuccess } from "./registration-success";
import { normalisePhone, validateRegistration } from "./validation";
import type { RegistrationFieldErrors, RegistrationInput } from "./validation";
import type { RegistrationEventView } from "./event-view";
import { cn } from "@/lib/cn";

/**
 * The registration flow, as one component with four states:
 *
 *   form → (validation error) → form
 *   form → submitting → success
 *   form → submitting → error → form
 *
 * The two reference screens are the `form` and `success` branches of this
 * panel, not two pages: there is exactly one place that can decide a
 * registration succeeded, and it is the resolved promise below.
 */
type PanelState =
  | { readonly status: "form" }
  | { readonly status: "submitting" }
  | { readonly status: "error"; readonly message: string }
  | { readonly status: "success"; readonly receipt: EventRegistrationReceipt };

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

export function RegistrationPanel({
  event,
  className,
}: {
  event: RegistrationEventView;
  className?: string;
}) {
  const [state, setState] = React.useState<PanelState>({ status: "form" });
  const [values, setValues] = React.useState<RegistrationInput>({ fullName: "", phone: "" });
  const [errors, setErrors] = React.useState<RegistrationFieldErrors>({});

  React.useEffect(() => {
    track({ name: "registration_started", eventSlug: event.slug });
  }, [event.slug]);

  const submitting = state.status === "submitting";

  function change(patch: Partial<RegistrationInput>): void {
    setValues((current) => ({ ...current, ...patch }));
    // Clear a field's error as soon as it is edited: keeping it visible while
    // the member fixes it reads as the fix not having worked.
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof RegistrationInput)[]) delete next[key];
      return next;
    });
    if (state.status === "error") setState({ status: "form" });
  }

  async function submit(): Promise<void> {
    if (submitting) return;

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
    <section
      aria-label="ثبت‌نام رویداد"
      className={cn(
        "w-full rounded-[var(--ev-radius-card)] bg-[var(--ev-card)] p-[var(--ev-pad-card)]",
        "shadow-[var(--ev-shadow-card)]",
        className,
      )}
    >
      {/* One live region for the whole flow, so a submission that is still in
          flight, a failure and a confirmation are each announced once. */}
      <p role="status" aria-live="polite" className="sr-only">
        {state.status === "submitting" && "در حال ثبت‌نام…"}
        {state.status === "error" && state.message}
        {state.status === "success" && "ثبت‌نام انجام شد."}
      </p>

      {state.status === "success" ? (
        <RegistrationSuccess event={event} receipt={state.receipt} />
      ) : (
        <RegistrationForm
          event={event}
          values={values}
          errors={errors}
          serverError={state.status === "error" ? state.message : null}
          submitting={submitting}
          onChange={change}
          onSubmit={() => void submit()}
        />
      )}
    </section>
  );
}
