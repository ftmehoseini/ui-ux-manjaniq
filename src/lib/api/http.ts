import { ApiNotConfiguredError, type ManjaniqApi, type MatchFilter } from "./client";
import type {
  AppNotification,
  Connection,
  EventDetail,
  EventReadiness,
  EventSummary,
  Match,
  Member,
  NextAction,
  Opportunity,
  Readiness,
} from "@/lib/types";

/**
 * The real adapter. Deliberately thin: it maps interface methods onto REST
 * paths and does nothing else. It invents no defaults — when the backend is
 * absent the call fails loudly and the page shows an honest error state.
 */
export function createHttpApi(baseUrl: string | undefined): ManjaniqApi {
  async function get<T>(path: string): Promise<T> {
    if (!baseUrl) throw new ApiNotConfiguredError();
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { accept: "application/json" },
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Manjaniq API ${path} responded ${response.status}`);
    }
    return (await response.json()) as T;
  }

  return {
    kind: "http",
    getMember: () => get<Member | null>("/me"),
    getReadiness: () => get<Readiness>("/me/readiness"),
    getNextActions: () => get<readonly NextAction[]>("/me/next-actions"),
    listMatches: (filter?: MatchFilter) => {
      const params = new URLSearchParams();
      if (filter?.kind) params.set("kind", filter.kind);
      if (filter?.query) params.set("q", filter.query);
      const suffix = params.size > 0 ? `?${params.toString()}` : "";
      return get<readonly Match[]>(`/matches${suffix}`);
    },
    getMatch: (id: string) => get<Match | null>(`/matches/${encodeURIComponent(id)}`),
    listOpportunities: () => get<readonly Opportunity[]>("/opportunities"),
    listEvents: () => get<readonly EventSummary[]>("/events"),
    getEvent: (slug: string) => get<EventDetail | null>(`/events/${encodeURIComponent(slug)}`),
    getEventReadiness: () => get<EventReadiness | null>("/me/event-readiness"),
    listConnections: () => get<readonly Connection[]>("/connections"),
    listNotifications: () => get<readonly AppNotification[]>("/notifications"),
  };
}
