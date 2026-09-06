/**
 * Persian formatting helpers.
 *
 * Convention: numbers rendered in the interface use Persian-Indic digits.
 * Anything a person must copy verbatim would stay Latin and be wrapped in
 * `.latin`.
 */

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;
const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Converts every ASCII digit in `input` to its Persian-Indic equivalent. */
export function faDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

/**
 * Converts Persian and Arabic-Indic digits back to ASCII.
 *
 * Anything typed into a form has to make this trip before it is validated or
 * sent: someone typing ۰۹۱۲ on a Persian keyboard and someone typing 0912 have
 * entered the same phone number, and only one of them should not have to find
 * out that the field disagrees.
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

/** Toman price. Prices are quoted in تومان and stored as toman integers. */
export function faPrice(toman: number): string {
  return `${faNumber(toman)} تومان`;
}

/**
 * Event clock and calendar, fixed to the venue's timezone.
 *
 * A door time has to mean 9:15 at the venue whether the page is opened in
 * Tehran or in Berlin, so these never render in the reader's own timezone. The
 * hour is `numeric` rather than `2-digit` because «۹:۱۵» is how the time is
 * spoken and printed on the ticket, not «۰۹:۱۵».
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
