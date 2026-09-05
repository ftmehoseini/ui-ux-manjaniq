import type { ManjaniqApi, MatchFilter } from "./client";
import type {
  AppNotification,
  Connection,
  EventDetail,
  EventReadiness,
  Match,
  Member,
  NextAction,
  Opportunity,
  Person,
  Readiness,
} from "@/lib/types";

/**
 * Development data source.
 *
 * This exists so the interface can be built and reviewed without a backend.
 * Two rules govern it:
 *
 *  1. It is never the default in production. `getApi()` selects it only when
 *     the app is explicitly configured for sample data, and the application
 *     shell renders a persistent banner whenever it is active, so a sample
 *     screen can never be mistaken for a real one.
 *  2. It contains no public trust claims. There are no testimonials, no
 *     outcome statistics, no participant logos and no company names presented
 *     as customers here. Those live in `src/content/proof.ts`, which ships
 *     empty on purpose. Sample people are obviously placeholder personas used
 *     to exercise the match layout — nothing in this file is ever rendered on
 *     a public marketing page.
 */

const DAY = 86_400_000;
const iso = (offsetDays: number): string =>
  new Date(Date.now() + offsetDays * DAY).toISOString();

function person(
  id: string,
  name: string,
  role: string,
  company: string,
  headline: string,
  extra: Partial<Person> = {},
): Person {
  return {
    id,
    name,
    role,
    company,
    headline,
    industry: extra.industry,
    city: extra.city ?? "تهران",
    verification: extra.verification ?? {
      identity: true,
      company: true,
      attendedEvents: 1,
    },
    visibility: extra.visibility ?? "full",
  };
}

const SAMPLE_MEMBER: Member = {
  ...person(
    "me",
    "نمونه کاربر",
    "بنیان‌گذار",
    "استودیو نمونه",
    "روی محصولی برای مدیریت زنجیرهٔ تأمین کار می‌کنم.",
    { industry: "نرم‌افزار سازمانی" },
  ),
  needs: [
    {
      id: "n1",
      kind: "customers",
      title: "پنج مشتری سازمانی در حوزهٔ پخش",
      detail: "شرکت‌های پخش با بیش از پنجاه نیروی فروش میدانی.",
      horizon: "now",
      provenance: "declared",
    },
    {
      id: "n2",
      kind: "talent",
      title: "مدیر فروش سازمانی",
      horizon: "quarter",
      provenance: "declared",
    },
  ],
  strengths: [
    {
      id: "s1",
      title: "طراحی و اجرای محصول SaaS",
      detail: "از صفر تا نسخهٔ پایدار، با تیم کوچک.",
      conceptId: "product.saas",
      provenance: "declared",
    },
    {
      id: "s2",
      title: "یکپارچه‌سازی با سامانه‌های حسابداری ایرانی",
      conceptId: "integration.accounting.ir",
      provenance: "canonical",
    },
  ],
  preferences: {
    focus: ["customers", "talent"],
    industries: ["پخش و توزیع", "خرده‌فروشی"],
    cities: ["تهران"],
    openToDiscovery: true,
  },
  onboardingStep: "complete",
};

const SAMPLE_READINESS: Readiness = {
  score: 82,
  matchable: true,
  gaps: [
    {
      id: "g1",
      action: "اندازهٔ مشتری هدف را مشخص کن",
      effect: "پیشنهادها به شرکت‌هایی محدود می‌شود که واقعاً در اندازهٔ تو هستند.",
      weight: "high",
      href: "/app/profile#needs",
    },
    {
      id: "g2",
      action: "یک نمونهٔ کار به توانمندی‌هایت اضافه کن",
      effect: "طرف مقابل زودتر می‌فهمد دقیقاً در چه چیزی می‌توانی کمک کنی.",
      weight: "medium",
      href: "/app/profile#strengths",
    },
  ],
};

const SAMPLE_MATCHES: readonly Match[] = [
  {
    id: "m1",
    person: person(
      "p1",
      "سارا رستمی",
      "مدیر عملیات",
      "پخش سراسری آریا",
      "شبکهٔ پخش با ۱۸۰ نیروی فروش در نه استان.",
      { industry: "پخش و توزیع" },
    ),
    status: "new",
    createdAt: iso(-1),
    context: "رویداد فرصت‌های عملیات، دور دوم",
    forYou: {
      need: SAMPLE_MEMBER.needs[0]!,
      strength: {
        id: "ps1",
        title: "مدیریت شبکهٔ پخش سازمانی",
        detail: "مسئول انتخاب و استقرار ابزارهای میدانی فروش.",
        provenance: "declared",
      },
      rationale: {
        value:
          "او همان نوع مشتری‌ای است که دنبالش هستی و خودش مسئول انتخاب ابزار در شرکتش است.",
        provenance: "inferred",
        confidence: 0.78,
        basis: "نیاز اعلامی تو و نقش اعلامی او",
      },
    },
    forThem: {
      need: {
        id: "pn1",
        kind: "expertise",
        title: "ابزار ثبت سفارش میدانی",
        detail: "جایگزینی فرایند کاغذی نیروهای فروش.",
        horizon: "now",
        provenance: "declared",
      },
      strength: SAMPLE_MEMBER.strengths[0]!,
      rationale: {
        value: "چیزی که او دنبالش است دقیقاً همان محصولی است که تو ساخته‌ای.",
        provenance: "inferred",
        confidence: 0.81,
        basis: "نیاز اعلامی او و توانمندی اعلامی تو",
      },
    },
    reasons: [
      {
        kind: "complementary",
        label: "نیاز او را می‌توانی پوشش بدهی",
        detail: "ثبت سفارش میدانی، همان دستهٔ محصولی توست.",
        provenance: "canonical",
      },
      {
        kind: "industry",
        label: "هر دو در حوزهٔ پخش و توزیع",
        provenance: "declared",
      },
      {
        kind: "shared_context",
        label: "هر دو در رویداد آذرماه شرکت داشته‌اید",
        provenance: "declared",
      },
    ],
    relevance: {
      score: 88,
      basis: [
        "پوشش دوطرفهٔ نیاز و توانمندی",
        "هم‌صنعتی",
        "هر دو نیاز با افق «همین حالا» ثبت شده",
      ],
    },
    conversationStarters: [
      {
        value: "الان نیروهای فروشتان سفارش را چطور ثبت می‌کنند؟",
        provenance: "inferred",
        basis: "نیاز اعلامی او",
      },
      {
        value: "برای جایگزینی فرایند کاغذی چه چیزی را امتحان کرده‌اید؟",
        provenance: "inferred",
      },
    ],
    uncertainties: [
      "بودجه یا زمان‌بندی خرید او در پروفایل مشخص نشده است.",
    ],
    sharedContext: ["رویداد فرصت‌های عملیات — آذر", "هر دو مستقر در تهران"],
  },
  {
    id: "m2",
    person: person(
      "p2",
      "بهنام کاظمی",
      "مدیر فروش سازمانی",
      "مستقل",
      "ده سال فروش نرم‌افزار سازمانی به شرکت‌های پخش.",
      { industry: "فروش سازمانی", verification: { identity: true, company: false, attendedEvents: 2 } },
    ),
    status: "viewed",
    createdAt: iso(-3),
    forYou: {
      need: SAMPLE_MEMBER.needs[1]!,
      strength: {
        id: "ps2",
        title: "ساخت تیم فروش سازمانی از صفر",
        provenance: "declared",
      },
      rationale: {
        value: "دقیقاً همان نقشی را داشته که تو می‌خواهی پر کنی.",
        provenance: "inferred",
        confidence: 0.72,
        basis: "سابقهٔ اعلامی او",
      },
    },
    forThem: {
      need: {
        id: "pn2",
        kind: "partner",
        title: "محصولی برای فروش در شبکهٔ فعلی‌اش",
        horizon: "exploring",
        provenance: "declared",
      },
      strength: SAMPLE_MEMBER.strengths[0]!,
      rationale: {
        value: "او شبکه دارد و محصول ندارد؛ تو محصول داری و شبکه نداری.",
        provenance: "inferred",
        confidence: 0.66,
      },
    },
    reasons: [
      { kind: "complementary", label: "شبکهٔ فروش در برابر محصول", provenance: "inferred" },
      { kind: "goal_alignment", label: "هر دو دنبال مسیر فروش سازمانی", provenance: "canonical" },
    ],
    relevance: null,
    conversationStarters: [
      { value: "شبکهٔ فعلی‌ات بیشتر روی کدام دسته محصول جواب می‌دهد؟", provenance: "inferred" },
    ],
    uncertainties: [
      "شرکت او تأیید نشده است.",
      "افق نیاز او «در حال بررسی» است، نه فوری.",
    ],
    sharedContext: ["هر دو مستقر در تهران"],
  },
];

const SAMPLE_OPPORTUNITIES: readonly Opportunity[] = [
  {
    id: "o1",
    kind: "customers",
    title: "درخواست ابزار ثبت سفارش برای شبکهٔ پخش استانی",
    summary:
      "یک شبکهٔ پخش با ۹۰ نیروی میدانی دنبال جایگزین فرایند کاغذی ثبت سفارش است.",
    source: null,
    relevance: {
      score: 74,
      basis: ["هم‌خوانی با نیاز «پنج مشتری سازمانی در حوزهٔ پخش»"],
    },
    matchedNeeds: [SAMPLE_MEMBER.needs[0]!],
    reasons: [{ kind: "goal_alignment", label: "هم‌خوان با نیاز فعلی تو", provenance: "canonical" }],
    postedAt: iso(-2),
    closesAt: iso(12),
  },
];

const SAMPLE_EVENT: EventDetail = {
  id: "e1",
  slug: "forsat-amaliat-esfand",
  title: "رویداد فرصت‌های عملیات",
  tagline: "چهل نفر، انتخاب‌شده بر اساس نیاز و توانمندی، در یک بعدازظهر.",
  startsAt: iso(21),
  endsAt: iso(21),
  city: "تهران",
  venue: "سالن رویداد — نشانی پس از ثبت‌نام",
  state: "open",
  capacity: 40,
  about:
    "هر دور گفت‌وگو بر اساس نیاز اعلامی شرکت‌کننده‌ها چیده می‌شود. کسی به‌صورت تصادفی سر یک میز نمی‌نشیند.",
  format: [
    { title: "چهار دور گفت‌وگو", detail: "هر دور بیست دقیقه، سه نفر سر هر میز." },
    { title: "چیدمان بر اساس نیاز", detail: "میز هر دور از روی نیاز و توانمندی ثبت‌شده انتخاب می‌شود." },
    { title: "ثبت نتیجه", detail: "بعد از رویداد، نتیجهٔ هر گفت‌وگو را ثبت می‌کنی." },
  ],
  selection: [
    {
      title: "نیاز مشخص",
      detail: "شرکت‌کننده باید دست‌کم یک نیاز روشن ثبت کرده باشد تا بتوان برایش میز چید.",
    },
    {
      title: "توانمندی قابل ارائه",
      detail: "هر نفر باید بتواند برای دیگران کاری انجام دهد، نه فقط چیزی بخواهد.",
    },
    {
      title: "بررسی هویت و شرکت",
      detail: "هویت و شرکت هر شرکت‌کننده پیش از تأیید نهایی بررسی می‌شود.",
    },
  ],
  composition: [
    { label: "بنیان‌گذار و مدیرعامل", share: 46 },
    { label: "مدیر ارشد کسب‌وکار", share: 28 },
    { label: "سرمایه‌گذار و مشاور", share: 14 },
    { label: "متخصص و مدیر فنی", share: 12 },
  ],
  agenda: [
    { time: "۱۵:۳۰", title: "پذیرش و ثبت ورود" },
    { time: "۱۶:۰۰", title: "دور اول", detail: "چیدمان بر اساس نیاز اصلی" },
    { time: "۱۶:۳۰", title: "دور دوم", detail: "چیدمان مکمل" },
    { time: "۱۷:۱۵", title: "استراحت" },
    { time: "۱۷:۴۵", title: "دور سوم و چهارم" },
    { time: "۱۹:۰۰", title: "گفت‌وگوی آزاد و ثبت نتیجه" },
  ],
  priceIrr: 2_400_000,
  registrationUrl: null,
};

const SAMPLE_CONNECTIONS: readonly Connection[] = [
  {
    id: "c1",
    person: person("p3", "مینا شریفی", "مدیر محصول", "رهنما", "روی زیرساخت پرداخت کار می‌کند.", {
      industry: "فین‌تک",
    }),
    stage: "following_up",
    metAt: iso(-9),
    origin: "رویداد فرصت‌های عملیات — آذر",
    outcomes: [{ kind: "following_up", recordedAt: iso(-8), note: "قرار شد مستندات فنی را بفرستم." }],
    followUpDueAt: iso(-1),
  },
  {
    id: "c2",
    person: person("p4", "کاوه امینی", "بنیان‌گذار", "دادهٔ نو", "تحلیل داده برای خرده‌فروشی.", {
      industry: "تحلیل داده",
    }),
    stage: "met",
    metAt: iso(-9),
    origin: "رویداد فرصت‌های عملیات — آذر",
    outcomes: [],
    followUpDueAt: iso(2),
  },
];

const SAMPLE_NOTIFICATIONS: readonly AppNotification[] = [
  {
    id: "nt1",
    title: "دو پیشنهاد تازه",
    detail: "بر اساس نیاز «پنج مشتری سازمانی در حوزهٔ پخش».",
    createdAt: iso(-1),
    read: false,
    href: "/app/matches",
  },
  {
    id: "nt2",
    title: "یک پیگیری به موعدش رسیده",
    detail: "گفت‌وگو با مینا شریفی منتظر اقدام توست.",
    createdAt: iso(-2),
    read: false,
    href: "/app/connections",
  },
];

const SAMPLE_ACTIONS: readonly NextAction[] = [
  {
    id: "a1",
    kind: "review_matches",
    title: "۲ پیشنهاد تازه برای تو",
    detail: "هر دو با نیاز فعلی‌ات هم‌خوان‌اند و دلیلش مشخص است.",
    ctaLabel: "دیدن پیشنهادها",
    href: "/app/matches",
    priority: 1,
    count: 2,
  },
  {
    id: "a2",
    kind: "follow_up",
    title: "یک ارتباط منتظر پیگیری است",
    detail: "قرار بود مستندات فنی را برای مینا شریفی بفرستی.",
    ctaLabel: "ثبت پیگیری",
    href: "/app/connections",
    priority: 2,
    count: 1,
  },
  {
    id: "a3",
    kind: "event_prep",
    title: "تا رویداد بعدی سه هفته مانده",
    detail: "چیدمان میزها از روی نیازهای ثبت‌شده انجام می‌شود.",
    ctaLabel: "آماده‌سازی رویداد",
    href: "/app/events",
    priority: 3,
  },
];

const SAMPLE_EVENT_READINESS: EventReadiness = {
  event: SAMPLE_EVENT,
  registered: true,
  roundsPublished: false,
  checklist: [
    { id: "k1", label: "نیازهایت را مشخص کرده‌ای", done: true, href: "/app/profile#needs" },
    { id: "k2", label: "توانمندی‌هایت را نوشته‌ای", done: true, href: "/app/profile#strengths" },
    { id: "k3", label: "اندازهٔ مشتری هدف را مشخص کن", done: false, href: "/app/profile#needs" },
  ],
};

export function createSampleApi(): ManjaniqApi {
  return {
    kind: "sample",
    getMember: async () => SAMPLE_MEMBER,
    getReadiness: async () => SAMPLE_READINESS,
    getNextActions: async () => SAMPLE_ACTIONS,
    listMatches: async (filter?: MatchFilter) => {
      if (!filter?.kind) return SAMPLE_MATCHES;
      return SAMPLE_MATCHES.filter((m) => m.forYou.need.kind === filter.kind);
    },
    getMatch: async (id: string) => SAMPLE_MATCHES.find((m) => m.id === id) ?? null,
    listOpportunities: async () => SAMPLE_OPPORTUNITIES,
    listEvents: async () => [SAMPLE_EVENT],
    getEvent: async (slug: string) => (slug === SAMPLE_EVENT.slug ? SAMPLE_EVENT : null),
    getEventReadiness: async () => SAMPLE_EVENT_READINESS,
    listConnections: async () => SAMPLE_CONNECTIONS,
    listNotifications: async () => SAMPLE_NOTIFICATIONS,
  };
}
