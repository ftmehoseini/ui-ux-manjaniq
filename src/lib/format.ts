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

const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/**
 * Converts Persian and Arabic-Indic digits back to ASCII.
 *
 * Anything typed into a form has to make this trip before it is validated or
 * sent: a member typing ۰۹۱۲ on a Persian keyboard and a member typing 0912
 * have entered the same phone number, and only one of them should not have to
 * find out that the field disagrees.
 */
export function latinDigits(input: string): string {
  return input.replace(/[۰-۹٠-٩]/g, (d) => {
    const persian = PERSIAN_DIGITS.indexOf(d as (typeof PERSIAN_DIGITS)[number]);
    if (persian >= 0) return String(persian);
    return String(ARABIC_INDIC_DIGITS.indexOf(d));
  });
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

/** Groups a national mobile number for reading: «۰۹۱۲ ۳۴۵ ۶۷۸۹». */
export function faPhone(phone: string): string {
  const digits = latinDigits(phone).replace(/\D/g, "");
  return faDigits(digits.replace(/^(\d{4})(\d{3})(\d{4})$/, "$1 $2 $3"));
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

/**
 * Event clock and calendar, fixed to the venue's timezone.
 *
 * The other formatters here render in the reader's own timezone, which is
 * right for "۳ روز پیش" and wrong for a door time: «ساعت ۹:۱۵» has to mean
 * 9:15 at the venue whether the member opens the page in Tehran or in Berlin.
 * The hour is `numeric` rather than `2-digit` because «۹:۱۵» is how the time
 * is spoken and printed on the ticket, not «۰۹:۱۵».
 */
const EVENT_TIME_ZONE = "Asia/Tehran";

const FA_EVENT_TIME = new Intl.DateTimeFormat("fa-IR", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: EVENT_TIME_ZONE,
});

const FA_EVENT_DATE = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: EVENT_TIME_ZONE,
});

/** Venue-local clock time, e.g. «۹:۱۵». */
export function faEventTime(iso: string): string {
  return FA_EVENT_TIME.format(new Date(iso));
}

/** Venue-local Jalali date, e.g. «۲۷ شهریور ۱۴۰۵». */
export function faEventDate(iso: string): string {
  return FA_EVENT_DATE.format(new Date(iso));
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
