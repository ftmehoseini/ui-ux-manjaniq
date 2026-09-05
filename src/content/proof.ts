import type { OutcomeStory } from "@/lib/types";

/**
 * PUBLIC TRUST CONTENT — REAL EVIDENCE ONLY.
 *
 * This file is empty by design. Outcome stories, participant counts and
 * partner logos are trust claims: publishing an invented one costs more than
 * showing nothing. Every component that reads from here renders a deliberate
 * empty state instead of placeholder content, so the homepage is honest on
 * day one and improves the moment real, consented material exists.
 *
 * To publish a story: add an entry whose `consented` flag is literally `true`
 * — the type makes that mandatory, so an unconsented story cannot compile.
 */
export const OUTCOME_STORIES: readonly OutcomeStory[] = [];

/**
 * Aggregate figures for the public site. `null` means "not published yet" and
 * renders as an omitted row, never as a zero or a placeholder.
 */
export interface PublicMetrics {
  readonly membersScreened: number | null;
  readonly eventsHeld: number | null;
  readonly introductionsRequested: number | null;
  readonly recordedOutcomes: number | null;
}

export const PUBLIC_METRICS: PublicMetrics = {
  membersScreened: null,
  eventsHeld: null,
  introductionsRequested: null,
  recordedOutcomes: null,
};
