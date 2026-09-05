/**
 * Persian formatting helpers.
 *
 * Product convention: numbers rendered in the interface use Persian-Indic
 * digits. Anything the user must copy verbatim — emails, URLs, invoice
 * references — stays in Latin digits and is wrapped in `.latin`.
 */

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

/** Converts every ASCII digit in `input` to its Persian-Indic equivalent. */
export function faDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

/** Thousands-separated Persian number: 12500 → «۱۲٬۵۰۰». */
export function faNumber(value: number): string {
  return faDigits(value.toLocaleString("en-US")).replace(/,/g, "٬");
}

/** Percent with a Persian sign: 82 → «۸۲٪». */
export function faPercent(value: number): string {
  return `${faDigits(Math.round(value))}٪`;
}

/** Toman price. Manjaniq quotes prices in تومان, stored as IRR-toman integers. */
export function faPrice(toman: number): string {
  return `${faNumber(toman)} تومان`;
}

const FA_DATE = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const FA_DATE_TIME = new Intl.DateTimeFormat("fa-IR", {
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const FA_TIME = new Intl.DateTimeFormat("fa-IR", {
  hour: "2-digit",
  minute: "2-digit",
});

/** Jalali date, e.g. «۱۴ آذر ۱۴۰۴». */
export function faDate(iso: string): string {
  return FA_DATE.format(new Date(iso));
}

export function faDateTime(iso: string): string {
  return FA_DATE_TIME.format(new Date(iso));
}

export function faTime(iso: string): string {
  return FA_TIME.format(new Date(iso));
}

const RELATIVE = new Intl.RelativeTimeFormat("fa-IR", { numeric: "auto" });

/**
 * «۳ روز پیش» / «فردا». Used for match freshness and follow-up due dates,
 * where an exact timestamp is noise.
 */
export function faRelative(iso: string, now: Date = new Date()): string {
  const deltaMs = new Date(iso).getTime() - now.getTime();
  const minutes = Math.round(deltaMs / 60_000);
  if (Math.abs(minutes) < 60) return RELATIVE.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return RELATIVE.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return RELATIVE.format(days, "day");
  return RELATIVE.format(Math.round(days / 30), "month");
}

/** Inclusive day span between two ISO dates, for multi-day events. */
export function faDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (start.toDateString() === end.toDateString()) {
    return `${faDate(startIso)}، ${faTime(startIso)} تا ${faTime(endIso)}`;
  }
  return `${faDate(startIso)} تا ${faDate(endIso)}`;
}

/** First grapheme of each of the first two words — avatar fallback. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? "")
    .join("");
}
