"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { RegistrationForm } from "./registration-form";
import { RegistrationSuccess } from "./registration-success";
import type { RegistrationEventView } from "./event-view";
import type { RegistrationFieldErrors, RegistrationInput } from "./validation";
import type { EventRegistrationReceipt } from "@/lib/types";

/**
 * The four states of a registration.
 *
 *   form → (validation error) → form
 *   form → submitting → success
 *   form → submitting → error → form
 *
 * The two reference screens are the `form` and `success` branches of this one
 * type, not two pages. `RegistrationStage` owns the value; the panel only
 * renders it.
 */
export type PanelState =
  | { readonly status: "form" }
  | { readonly status: "submitting" }
  | { readonly status: "error"; readonly message: string }
  | { readonly status: "success"; readonly receipt: EventRegistrationReceipt };

/**
 * The white card.
 *
 * Presentational: it decides what a state looks like, never how a state is
 * reached. That keeps the one place a registration can be declared successful
 * — the resolved API promise in `RegistrationStage` — impossible to miss.
 */
export function RegistrationPanel({
  event,
  state,
  values,
  errors,
  onChange,
  onSubmit,
  className,
}: {
  event: RegistrationEventView;
  state: PanelState;
  values: RegistrationInput;
  errors: RegistrationFieldErrors;
  onChange: (patch: Partial<RegistrationInput>) => void;
  onSubmit: () => void;
  className?: string;
}) {
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
          submitting={state.status === "submitting"}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      )}
    </section>
  );
}
