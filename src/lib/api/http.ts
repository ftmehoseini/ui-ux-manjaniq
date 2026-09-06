import {
  ApiNotConfiguredError,
  ApiRequestError,
  type EventApi,
} from "./client";
import type {
  EventDetail,
  EventRegistrationReceipt,
  EventRegistrationRequest,
} from "@/lib/types";

/**
 * The real adapter. Deliberately thin: it maps interface methods onto REST
 * paths and does nothing else. It invents no defaults — when the backend is
 * absent the call fails loudly and the page shows an honest error state.
 *
 * If the real API differs, this is the only file that changes.
 */
export function createHttpApi(baseUrl: string | undefined): EventApi {
  async function get<T>(path: string): Promise<T> {
    if (!baseUrl) throw new ApiNotConfiguredError();
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { accept: "application/json" },
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) throw new ApiRequestError(response.status, path);
    return (await response.json()) as T;
  }

  async function post<T>(path: string, body: unknown): Promise<T> {
    if (!baseUrl) throw new ApiNotConfiguredError();
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json" },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new ApiRequestError(response.status, path);
    return (await response.json()) as T;
  }

  return {
    kind: "http",
    getEvent: (slug: string) => get<EventDetail | null>(`/events/${encodeURIComponent(slug)}`),
    registerForEvent: ({ eventSlug, ...body }: EventRegistrationRequest) =>
      post<EventRegistrationReceipt>(
        `/events/${encodeURIComponent(eventSlug)}/registrations`,
        body,
      ),
  };
}
