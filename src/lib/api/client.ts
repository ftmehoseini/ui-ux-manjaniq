import type {
  EventDetail,
  EventRegistrationReceipt,
  EventRegistrationRequest,
} from "@/lib/types";

/**
 * The surface the UI depends on.
 *
 * Every page reads through this interface, so swapping the data source is a
 * one-line change and no component holds a fetch call or a URL.
 */
export interface EventApi {
  readonly kind: "sample" | "http";

  getEvent(slug: string): Promise<EventDetail | null>;

  /**
   * Registers one person for an event. The only write in the surface, and the
   * single source of truth for the confirmation screen — the UI renders the
   * receipt it returns rather than echoing the form back at the visitor.
   */
  registerForEvent(input: EventRegistrationRequest): Promise<EventRegistrationReceipt>;
}

/**
 * Thrown by the HTTP adapter when no backend is configured. Callers catch this
 * and render an honest "not connected" state rather than fabricating content.
 */
export class ApiNotConfiguredError extends Error {
  constructor() {
    super("NEXT_PUBLIC_API_BASE_URL is not set; no backend is configured.");
    this.name = "ApiNotConfiguredError";
  }
}

/**
 * A non-2xx response. Carries the status so a caller can distinguish "the room
 * is full" from "we could not reach the server" and say the right thing; the
 * server's own message body is never shown to a visitor verbatim.
 */
export class ApiRequestError extends Error {
  readonly status: number;

  constructor(status: number, path: string) {
    super(`API ${path} responded ${status}`);
    this.name = "ApiRequestError";
    this.status = status;
  }
}
