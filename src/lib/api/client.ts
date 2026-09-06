import type {
  AppNotification,
  Connection,
  EventDetail,
  EventReadiness,
  EventRegistrationReceipt,
  EventRegistrationRequest,
  EventSummary,
  GoalKind,
  Match,
  Member,
  NextAction,
  Opportunity,
  Readiness,
} from "@/lib/types";

/**
 * The surface the UI depends on. Every page reads through this interface, so
 * swapping the data source is a one-line change and no component ever holds a
 * fetch call or a URL.
 */
export interface ManjaniqApi {
  readonly kind: "sample" | "http";

  getMember(): Promise<Member | null>;
  getReadiness(): Promise<Readiness>;
  getNextActions(): Promise<readonly NextAction[]>;

  listMatches(filter?: MatchFilter): Promise<readonly Match[]>;
  getMatch(id: string): Promise<Match | null>;

  listOpportunities(): Promise<readonly Opportunity[]>;

  listEvents(): Promise<readonly EventSummary[]>;
  getEvent(slug: string): Promise<EventDetail | null>;
  getEventReadiness(): Promise<EventReadiness | null>;
  /**
   * Registers one person for an event. The only write in the public surface,
   * and the single source of truth for the success screen — the UI renders the
   * receipt it returns rather than echoing the form back at the member.
   */
  registerForEvent(input: EventRegistrationRequest): Promise<EventRegistrationReceipt>;

  listConnections(): Promise<readonly Connection[]>;
  listNotifications(): Promise<readonly AppNotification[]>;
}

export interface MatchFilter {
  readonly kind?: GoalKind;
  readonly query?: string;
}

/**
 * Thrown by the HTTP adapter when no backend is configured. Pages catch this
 * and render a "not connected" state rather than fabricating content.
 */
export class ApiNotConfiguredError extends Error {
  constructor() {
    super("NEXT_PUBLIC_API_BASE_URL is not set; no Manjaniq backend is configured.");
    this.name = "ApiNotConfiguredError";
  }
}

/**
 * A non-2xx response. Carries the status so a caller can distinguish "the
 * room is full" from "we could not reach the server" and say the right thing;
 * the server's own message body is never shown to a member verbatim.
 */
export class ApiRequestError extends Error {
  readonly status: number;

  constructor(status: number, path: string) {
    super(`Manjaniq API ${path} responded ${status}`);
    this.name = "ApiRequestError";
    this.status = status;
  }
}
