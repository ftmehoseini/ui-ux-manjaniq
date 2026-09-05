import type { ConnectionStage, GoalKind, Horizon, OutcomeKind, Provenance } from "./types";

/**
 * Persian labels for the domain enums. Kept in one place so that a wording
 * change lands everywhere at once, and so no component invents its own phrasing.
 */

export const GOAL_LABELS: Record<GoalKind, string> = {
  partner: "شریک تجاری",
  customers: "مشتری",
  investors: "سرمایه‌گذار",
  fundraising: "جذب سرمایه",
  market_expansion: "توسعهٔ بازار",
  business_development: "توسعهٔ کسب‌وکار",
  talent: "نیروی متخصص",
  expertise: "تخصص و مشاوره",
  collaborators: "همکار پروژه",
  cofounder: "هم‌بنیان‌گذار",
  discovery: "کشف فرصت",
};

/** Short verb phrase used when the goal appears inside a sentence. */
export const GOAL_SEEKING: Record<GoalKind, string> = {
  partner: "دنبال شریک تجاری",
  customers: "دنبال مشتری",
  investors: "دنبال سرمایه‌گذار",
  fundraising: "در حال جذب سرمایه",
  market_expansion: "دنبال توسعهٔ بازار",
  business_development: "دنبال توسعهٔ کسب‌وکار",
  talent: "دنبال نیروی متخصص",
  expertise: "دنبال تخصص",
  collaborators: "دنبال همکار",
  cofounder: "دنبال هم‌بنیان‌گذار",
  discovery: "دنبال فرصت‌های تازه",
};

export const HORIZON_LABELS: Record<Horizon, string> = {
  now: "همین حالا",
  quarter: "این فصل",
  exploring: "در حال بررسی",
};

export const STAGE_LABELS: Record<ConnectionStage, string> = {
  met: "آشنا شده",
  following_up: "در حال پیگیری",
  meeting_scheduled: "جلسهٔ بعدی تنظیم شده",
  opportunity: "به فرصت رسیده",
  closed: "بسته‌شده",
};

export const OUTCOME_LABELS: Record<OutcomeKind, string> = {
  next_meeting: "جلسهٔ بعدی گذاشتم",
  following_up: "در حال پیگیری‌ام",
  introduction_made: "یک معرفی انجام شد",
  collaboration: "به همکاری رسید",
  customer: "به فرصت مشتری رسید",
  investment: "به سرمایه‌گذاری رسید",
  not_relevant: "ارتباط مفید نبود",
};

/**
 * How each provenance level is described to a member. Internal engineering
 * vocabulary ("canonical", "graph inference") never reaches the interface.
 */
export const PROVENANCE_LABELS: Record<Provenance, string> = {
  declared: "گفتهٔ خودش",
  canonical: "دستهٔ ثبت‌شده",
  inferred: "برداشت منجنیق",
};

export const PROVENANCE_HINTS: Record<Provenance, string> = {
  declared: "این را خود عضو در پروفایلش نوشته است.",
  canonical: "این مورد بر اساس اطلاعات عضو در دسته‌بندی منجنیق ثبت شده است.",
  inferred: "این برداشت منجنیق از اطلاعات موجود است، نه گفتهٔ مستقیم عضو.",
};
