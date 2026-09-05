import type { ConceptOption } from "@/components/ui/concept-picker";

/**
 * A starting taxonomy for strengths and needs.
 *
 * The real concept list belongs to the matching engine — this is a seed set
 * shaped like it, so onboarding can be built and tested. It is grouped because
 * an ungrouped list of eighty items is unusable, and deliberately phrased in
 * the way a business owner would describe what they do, not in internal terms.
 */

export const STRENGTH_OPTIONS: readonly ConceptOption[] = [
  { id: "sales.enterprise", label: "فروش سازمانی", group: "فروش و بازار" },
  { id: "sales.channel", label: "ساخت شبکهٔ توزیع و نمایندگی", group: "فروش و بازار" },
  { id: "marketing.performance", label: "بازاریابی عملکردی و تبلیغات", group: "فروش و بازار" },
  { id: "marketing.brand", label: "برندسازی و جایگاه‌سازی", group: "فروش و بازار" },
  { id: "market.export", label: "صادرات و ورود به بازار خارجی", group: "فروش و بازار" },

  { id: "product.saas", label: "ساخت محصول نرم‌افزاری", group: "محصول و فناوری" },
  { id: "product.hardware", label: "توسعهٔ محصول سخت‌افزاری", group: "محصول و فناوری" },
  { id: "tech.data", label: "داده و تحلیل", group: "محصول و فناوری" },
  { id: "tech.infra", label: "زیرساخت و مقیاس‌پذیری", group: "محصول و فناوری" },
  { id: "integration.accounting.ir", label: "یکپارچه‌سازی با سامانه‌های حسابداری ایرانی", group: "محصول و فناوری" },

  { id: "ops.supplychain", label: "زنجیرهٔ تأمین و لجستیک", group: "عملیات" },
  { id: "ops.manufacturing", label: "تولید و کنترل کیفیت", group: "عملیات" },
  { id: "ops.retail", label: "مدیریت خرده‌فروشی", group: "عملیات" },

  { id: "finance.fundraising", label: "جذب سرمایه و مذاکره با سرمایه‌گذار", group: "مالی و حقوقی" },
  { id: "finance.modeling", label: "مدل مالی و قیمت‌گذاری", group: "مالی و حقوقی" },
  { id: "legal.contracts", label: "قرارداد و مسائل حقوقی کسب‌وکار", group: "مالی و حقوقی" },

  { id: "people.hiring", label: "جذب و ساخت تیم", group: "تیم و مدیریت" },
  { id: "people.leadership", label: "مدیریت تیم در دورهٔ رشد", group: "تیم و مدیریت" },
  { id: "advisory.strategy", label: "مشاورهٔ استراتژی کسب‌وکار", group: "تیم و مدیریت" },
] as const;

export const INDUSTRY_OPTIONS: readonly ConceptOption[] = [
  { id: "ind.software", label: "نرم‌افزار و فناوری" },
  { id: "ind.fintech", label: "فین‌تک و پرداخت" },
  { id: "ind.retail", label: "خرده‌فروشی" },
  { id: "ind.distribution", label: "پخش و توزیع" },
  { id: "ind.manufacturing", label: "تولید و صنعت" },
  { id: "ind.food", label: "غذا و کشاورزی" },
  { id: "ind.health", label: "سلامت و درمان" },
  { id: "ind.education", label: "آموزش" },
  { id: "ind.construction", label: "ساختمان و املاک" },
  { id: "ind.logistics", label: "حمل‌ونقل و لجستیک" },
  { id: "ind.media", label: "رسانه و تبلیغات" },
  { id: "ind.services", label: "خدمات حرفه‌ای" },
] as const;

export const CITY_OPTIONS: readonly ConceptOption[] = [
  { id: "city.tehran", label: "تهران" },
  { id: "city.mashhad", label: "مشهد" },
  { id: "city.isfahan", label: "اصفهان" },
  { id: "city.shiraz", label: "شیراز" },
  { id: "city.tabriz", label: "تبریز" },
  { id: "city.karaj", label: "کرج" },
  { id: "city.ahvaz", label: "اهواز" },
  { id: "city.qom", label: "قم" },
] as const;
