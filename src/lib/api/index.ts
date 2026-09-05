import { createHttpApi } from "./http";
import { createSampleApi } from "./sample";
import type { ManjaniqApi } from "./client";

export { ApiNotConfiguredError } from "./client";
export type { ManjaniqApi, MatchFilter } from "./client";

/**
 * Selects the data source.
 *
 * Sample data is opt-in via `NEXT_PUBLIC_DATA_SOURCE=sample`, with one
 * exception: local development with no backend configured falls back to it, so
 * `npm run dev` works on a clean checkout. A production build with no
 * `NEXT_PUBLIC_API_BASE_URL` gets the HTTP adapter and therefore honest
 * "not connected" states — it never silently serves sample content.
 */
export function getApi(): ManjaniqApi {
  const source = process.env.NEXT_PUBLIC_DATA_SOURCE;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (source === "sample") return createSampleApi();
  if (source === "http") return createHttpApi(baseUrl);
  if (!baseUrl && process.env.NODE_ENV === "development") return createSampleApi();
  return createHttpApi(baseUrl);
}

/** True when the visible data is placeholder content and must be labelled. */
export function isSampleData(): boolean {
  return getApi().kind === "sample";
}
