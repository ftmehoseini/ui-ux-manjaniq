import { latinDigits } from "@/lib/format";

export interface RegistrationInput {
  readonly fullName: string;
  readonly phone: string;
}

export type RegistrationFieldErrors = Partial<Record<keyof RegistrationInput, string>>;

/**
 * Normalises a typed mobile number to its national form.
 *
 * Accepts what people actually type: Persian or Arabic-Indic digits, spaces and
 * dashes, a `+98`/`0098` prefix, or a bare `9…`. Returns `null` when the result
 * is not a plausible Iranian mobile number.
 */
export function normalisePhone(raw: string): string | null {
  const digits = latinDigits(raw).replace(/[\s\-()]/g, "");
  const national = digits
    .replace(/^\+98/, "0")
    .replace(/^0098/, "0")
    .replace(/^98(?=9\d{9}$)/, "0")
    .replace(/^(?=9\d{9}$)/, "0");
  return /^09\d{9}$/.test(national) ? national : null;
}

/**
 * Validates the form before anything is sent.
 *
 * Messages name the field and say what is wrong with it — a submission that
 * fails silently, or one that says only «خطا», costs the member the
 * registration.
 */
export function validateRegistration(input: RegistrationInput): RegistrationFieldErrors {
  const errors: RegistrationFieldErrors = {};

  const name = input.fullName.trim();
  if (name.length === 0) {
    errors.fullName = "لطفاً نام و نام خانوادگی را وارد کنید.";
  } else if (name.length < 3) {
    errors.fullName = "نام واردشده کوتاه است. نام و نام خانوادگی کامل را بنویسید.";
  }

  if (input.phone.trim().length === 0) {
    errors.phone = "لطفاً شماره تماس را وارد کنید.";
  } else if (normalisePhone(input.phone) === null) {
    errors.phone = "شماره تماس واردشده معتبر نیست. نمونهٔ درست: ۰۹۱۲۳۴۵۶۷۸۹";
  }

  return errors;
}
