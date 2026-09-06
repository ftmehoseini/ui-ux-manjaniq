/**
 * The contract between this interface and whatever backend serves it.
 *
 * It is a standalone module rather than something inferred from an API client,
 * because the rules below are product constraints, not transport details:
 *
 *  - An event states its own price, door time and edition. Anything the
 *    organiser has not published is absent from the type as an optional field,
 *    so the interface can omit it rather than invent it.
 *  - A registration is only ever confirmed by a receipt. There is no shape in
 *    which the client can construct a successful registration for itself.
 */

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
  /** Photograph behind the whole stage. */
  readonly coverUrl?: string;
}

export interface EventDetail extends EventSummary {
  readonly priceIrr: number | null;
  /**
   * An external registration destination. When present the product hands the
   * visitor to it; when null, registration happens here.
   */
  readonly registrationUrl: string | null;

  /**
   * The edition marker rendered as the accented half of the masthead — the
   * «۲۲» in «تلسی تاک ۲۲». Optional: an event without editions simply renders
   * its title.
   */
  readonly edition?: string;
  /** Wide key image above the registration card. */
  readonly bannerUrl?: string;
  /**
   * ISO time the doors are counted from. Shown as an arrival reminder after a
   * successful registration, and omitted entirely when the organiser has not
   * published one — the interface never guesses a door time.
   */
  readonly arrivalDeadline?: string;
}

/* -------------------------------------------------------------------------- */
/* Registration                                                                */
/* -------------------------------------------------------------------------- */

/** What the registration form sends. Digits are normalised to Latin first. */
export interface EventRegistrationRequest {
  readonly eventSlug: string;
  readonly fullName: string;
  /** Normalised national mobile number, e.g. `09121234567`. */
  readonly phone: string;
  readonly quantity: number;
}

/**
 * Outcome of a registration.
 *
 * `confirmed` is the only status that means a seat is held. A backend that
 * reviews requests before admitting anyone reports `pending_review`, and the
 * confirmation screen says so rather than implying a confirmed seat.
 */
export type RegistrationStatus = "confirmed" | "pending_review" | "waitlisted";

/**
 * What the backend returns after a registration. The confirmation screen
 * renders this and nothing else — every name, count and time on it is server
 * truth, never the form's optimistic echo.
 */
export interface EventRegistrationReceipt {
  readonly id: string;
  readonly eventSlug: string;
  readonly fullName: string;
  readonly ticketQuantity: number;
  readonly status: RegistrationStatus;
  readonly registeredAt: string;
  /** ISO. Falls back to the event's own door time when the receipt omits it. */
  readonly arrivalDeadline?: string;
}
