/**
 * Manjaniq domain model.
 *
 * These types are the contract between the UI and whatever backend serves it.
 * They exist as a standalone module (rather than being inferred from an API
 * client) because the product rules below are design constraints, not
 * transport details:
 *
 *  - Every user-visible claim carries its `provenance`. The interface must be
 *    able to show whether a statement was typed by a person, normalised into
 *    an internal concept, or inferred by a model. Losing that distinction
 *    would make inference indistinguishable from fact.
 *  - A match is mutual by construction. There is no way to build a `Match`
 *    that only explains one side of the relevance.
 *  - Relevance scores are optional and always carry their basis. A bare
 *    percentage is unrepresentable.
 */

/* -------------------------------------------------------------------------- */
/* Provenance                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Where a piece of information came from.
 *
 * `declared`  — the member typed or selected it themselves.
 * `canonical` — a declared value normalised onto an internal taxonomy concept.
 * `inferred`  — derived by the matching engine. Never presented as certain.
 */
export type Provenance = "declared" | "canonical" | "inferred";

/** A value tagged with how it came to be known. */
export interface Attributed<T> {
  readonly value: T;
  readonly provenance: Provenance;
  /** 0–1. Only meaningful for `inferred`; the UI renders it as hedged language. */
  readonly confidence?: number;
  /** Human-readable justification, e.g. "از پروفایل لینکدین". */
  readonly basis?: string;
}

/* -------------------------------------------------------------------------- */
/* Goals, needs, strengths                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The opportunity taxonomy. Needs, strengths and opportunities all resolve to
 * one of these, which is what lets a person-to-person match and a standalone
 * opportunity share a single relevance model.
 */
export type GoalKind =
  | "partner"
  | "customers"
  | "investors"
  | "fundraising"
  | "market_expansion"
  | "business_development"
  | "talent"
  | "expertise"
  | "collaborators"
  | "cofounder"
  | "discovery";

/** How soon the member is acting on a need. Feeds match timing, not urgency theatre. */
export type Horizon = "now" | "quarter" | "exploring";

export interface Need {
  readonly id: string;
  readonly kind: GoalKind;
  /** Short, member-facing phrasing: "سرمایه‌گذار مرحلهٔ بذری". */
  readonly title: string;
  readonly detail?: string;
  readonly horizon: Horizon;
  readonly provenance: Provenance;
}

export interface Strength {
  readonly id: string;
  readonly title: string;
  readonly detail?: string;
  /** Canonical concept id when the strength has been normalised. */
  readonly conceptId?: string;
  readonly provenance: Provenance;
}

/* -------------------------------------------------------------------------- */
/* People                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * What a viewer is allowed to see. Enforced by the backend; the UI mirrors it
 * so that a restricted record renders as a deliberate limited state rather
 * than as missing data.
 */
export type ProfileVisibility = "full" | "limited" | "hidden";

/** Verified facts only. Absence of a badge is not a negative signal. */
export interface Verification {
  readonly identity: boolean;
  readonly company: boolean;
  readonly attendedEvents: number;
}

export interface Person {
  readonly id: string;
  readonly name: string;
  /** One line the member wrote about themselves. */
  readonly headline: string;
  readonly role: string;
  readonly company: string;
  readonly industry?: string;
  readonly city?: string;
  readonly avatarUrl?: string;
  readonly verification: Verification;
  readonly visibility: ProfileVisibility;
}

/** The signed-in member. Extends `Person` with the parts only they can see. */
export interface Member extends Person {
  readonly needs: readonly Need[];
  readonly strengths: readonly Strength[];
  readonly preferences: MatchPreferences;
  readonly onboardingStep: OnboardingStep;
}

export interface MatchPreferences {
  /** Goal kinds the member wants to be matched against. Empty = no filter. */
  readonly focus: readonly GoalKind[];
  readonly industries: readonly string[];
  readonly cities: readonly string[];
  /** Opt-in to being surfaced to people outside their own goal set. */
  readonly openToDiscovery: boolean;
}

/* -------------------------------------------------------------------------- */
/* Profile readiness                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Replaces a form-completion percentage. Each gap says what it costs the
 * member in match quality, so the number is always accompanied by a reason.
 */
export interface ReadinessGap {
  readonly id: string;
  /** "دو نیاز مشخص اضافه کن" */
  readonly action: string;
  /** What improves if they do it. */
  readonly effect: string;
  readonly weight: "high" | "medium" | "low";
  readonly href: string;
}

export interface Readiness {
  /** 0–100. Weighted by matching impact, not by fields filled. */
  readonly score: number;
  readonly gaps: readonly ReadinessGap[];
  /** True once the profile can produce matches at all. */
  readonly matchable: boolean;
}

/* -------------------------------------------------------------------------- */
/* Matching                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * One half of the mutual explanation: a need on one side met by a strength on
 * the other. The match card renders two of these, in both directions.
 */
export interface Coverage {
  readonly need: Need;
  readonly strength: Strength;
  /** Why this strength answers this need. Often inferred, so it is attributed. */
  readonly rationale: Attributed<string>;
}

export type ReasonKind =
  | "complementary"
  | "industry"
  | "goal_alignment"
  | "shared_context"
  | "evidence";

export interface MatchReason {
  readonly kind: ReasonKind;
  readonly label: string;
  readonly detail?: string;
  readonly provenance: Provenance;
}

/**
 * A relevance score. Present only when the engine can name what produced it.
 * `basis` is required, which is what stops "۹۲٪ تطابق" from ever standing alone.
 */
export interface Relevance {
  readonly score: number;
  readonly basis: readonly string[];
}

export type MatchStatus =
  | "new"
  | "viewed"
  | "intro_requested"
  | "intro_accepted"
  | "connected"
  | "archived";

export interface Match {
  readonly id: string;
  readonly person: Person;
  readonly status: MatchStatus;
  readonly createdAt: string;
  /** Where the match came from: an event round, the standing graph, etc. */
  readonly context?: string;

  /** What the viewer needs, and what this person can offer against it. */
  readonly forYou: Coverage;
  /** What this person needs, and what the viewer can offer against it. */
  readonly forThem: Coverage;

  readonly reasons: readonly MatchReason[];
  readonly relevance: Relevance | null;
  readonly conversationStarters: readonly Attributed<string>[];
  /** Honest caveats: thin profile, unverified company, stale need. */
  readonly uncertainties: readonly string[];
  readonly sharedContext: readonly string[];
}

/* -------------------------------------------------------------------------- */
/* Opportunities                                                               */
/* -------------------------------------------------------------------------- */

/**
 * An opportunity is relevance expressed without a person attached — a mandate,
 * a brief, an opening. It shares `GoalKind` with needs so that both can be
 * ranked by the same engine and shown in one feed later without a redesign.
 */
export interface Opportunity {
  readonly id: string;
  readonly kind: GoalKind;
  readonly title: string;
  readonly summary: string;
  /** Who posted it, when disclosure rules allow it. */
  readonly source: Person | null;
  readonly relevance: Relevance | null;
  /** Which of the viewer's needs this speaks to. */
  readonly matchedNeeds: readonly Need[];
  readonly reasons: readonly MatchReason[];
  readonly postedAt: string;
  readonly closesAt?: string;
}

/* -------------------------------------------------------------------------- */
/* Events                                                                      */
/* -------------------------------------------------------------------------- */

export type EventState = "announced" | "open" | "sold_out" | "live" | "past";

export interface EventSummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly city: string;
  readonly venue: string;
  readonly state: EventState;
  readonly capacity: number;
  readonly coverUrl?: string;
}

/** How participants are chosen. Shown publicly — it is the trust argument. */
export interface SelectionCriterion {
  readonly title: string;
  readonly detail: string;
}

export interface EventDetail extends EventSummary {
  readonly about: string;
  readonly format: readonly { title: string; detail: string }[];
  readonly selection: readonly SelectionCriterion[];
  /** Aggregate, consent-safe composition of who is in the room. */
  readonly composition: readonly CompositionSlice[];
  readonly agenda: readonly AgendaItem[];
  readonly priceIrr: number | null;
  readonly registrationUrl: string | null;
}

/** Never a named list. Aggregated counts only, so no profile is exposed. */
export interface CompositionSlice {
  readonly label: string;
  readonly share: number;
}

export interface AgendaItem {
  readonly time: string;
  readonly title: string;
  readonly detail?: string;
}

/** The member's own state for an upcoming event. */
export interface EventReadiness {
  readonly event: EventSummary;
  readonly registered: boolean;
  readonly checklist: readonly {
    id: string;
    label: string;
    done: boolean;
    href: string;
  }[];
  /** Match assignments stay null until the organiser publishes them. */
  readonly roundsPublished: boolean;
}

/* -------------------------------------------------------------------------- */
/* Connections and outcomes                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The funnel the product actually optimises for. Contact counts are not a
 * stage; a conversation that produced nothing stops at `met`.
 */
export type ConnectionStage =
  | "met"
  | "following_up"
  | "meeting_scheduled"
  | "opportunity"
  | "closed";

export type OutcomeKind =
  | "next_meeting"
  | "following_up"
  | "introduction_made"
  | "collaboration"
  | "customer"
  | "investment"
  | "not_relevant";

export interface Outcome {
  readonly kind: OutcomeKind;
  readonly note?: string;
  readonly recordedAt: string;
}

export interface Connection {
  readonly id: string;
  readonly person: Person;
  readonly stage: ConnectionStage;
  readonly metAt: string;
  /** Event or context where they met. */
  readonly origin: string;
  readonly outcomes: readonly Outcome[];
  /** Set when the connection is waiting on the member to do something. */
  readonly followUpDueAt?: string;
}

/* -------------------------------------------------------------------------- */
/* Next best action                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The dashboard is a ranked queue of these, not a grid of statistics. The
 * backend ranks them; the UI renders the order it is given.
 */
export type ActionKind =
  | "review_matches"
  | "complete_profile"
  | "event_prep"
  | "follow_up"
  | "record_outcome"
  | "review_opportunity";

export interface NextAction {
  readonly id: string;
  readonly kind: ActionKind;
  readonly title: string;
  readonly detail: string;
  readonly ctaLabel: string;
  readonly href: string;
  readonly priority: number;
  /** Rendered as a count badge, e.g. ۳ ارتباط. */
  readonly count?: number;
}

/* -------------------------------------------------------------------------- */
/* Notifications                                                               */
/* -------------------------------------------------------------------------- */

export interface AppNotification {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly createdAt: string;
  readonly read: boolean;
  readonly href?: string;
}

/* -------------------------------------------------------------------------- */
/* Public proof                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Outcome stories shown publicly. Every field must come from a real, consented
 * source — there is no placeholder variant of this type, and the components
 * that render it fall back to an empty state rather than sample content.
 */
export interface OutcomeStory {
  readonly id: string;
  readonly outcome: OutcomeKind;
  /** What actually happened, in the member's framing. */
  readonly summary: string;
  readonly quote?: string;
  readonly attribution?: string;
  readonly eventTitle?: string;
  readonly consented: true;
}

/* -------------------------------------------------------------------------- */
/* Onboarding                                                                  */
/* -------------------------------------------------------------------------- */

export type OnboardingStep =
  | "identity"
  | "strengths"
  | "needs"
  | "preferences"
  | "review"
  | "complete";

export const ONBOARDING_ORDER: readonly OnboardingStep[] = [
  "identity",
  "strengths",
  "needs",
  "preferences",
  "review",
] as const;
