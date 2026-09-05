"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, describedBy } from "@/components/ui/field";

/**
 * Sign-in form.
 *
 * The submit handler is intentionally not wired to an endpoint: no
 * authentication backend was available, and inventing one would produce a form
 * that appears to work and silently does nothing. It validates the input,
 * states plainly that the service is not connected, and leaves a single
 * obvious place to attach the real call.
 */
export function LoginForm() {
  const [phone, setPhone] = React.useState("");
  const [error, setError] = React.useState<string | undefined>();
  const [notice, setNotice] = React.useState<string | undefined>();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(undefined);

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("شمارهٔ موبایل کامل نیست.");
      return;
    }

    setError(undefined);
    // TODO: POST to the authentication endpoint once it exists.
    setNotice("سرویس ورود هنوز به این نسخه وصل نشده است.");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field
        id="phone"
        label="شمارهٔ موبایل"
        hint="کد ورود به همین شماره فرستاده می‌شود."
        error={error}
      >
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          placeholder="09xxxxxxxxx"
          value={phone}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy("phone", "hint", error)}
          onChange={(event) => setPhone(event.target.value)}
          className="latin text-start"
        />
      </Field>

      <Button type="submit" size="lg" block>
        فرستادن کد ورود
      </Button>

      {notice && (
        <p role="status" className="t-small rounded-md bg-warning-subtle px-3 py-2 text-warning">
          {notice}
        </p>
      )}
    </form>
  );
}
