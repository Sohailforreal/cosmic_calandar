import NodeCache from "node-cache";

/**
 * Two separate caches, matching the plan's caching split:
 *
 * - dailyCache: keyed by MM-DD. For data that does NOT depend on the year
 *   (historical facts, images searched by event name). This is what makes
 *   repeat requests for common birthdates nearly free.
 *
 * - yearlyCache: keyed by full YYYY-MM-DD. For data that DOES depend on the
 *   year (astronomy computations — a conjunction in 1990 is not the same
 *   event as one in 2020).
 *
 * stdTTL: 0 means "never expire" — this data is historical/computed and
 * does not go stale, so there's no need to re-fetch or re-compute it.
 */
export const dailyCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });
export const yearlyCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

// Helper: normalize a YYYY-MM-DD date string into its MM-DD key.
export function toMonthDayKey(dateStr) {
  const [, month, day] = dateStr.split("-");
  return `${month}-${day}`;
}
