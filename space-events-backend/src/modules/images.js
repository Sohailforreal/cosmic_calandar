import { dailyCache } from "../config/cache.js";

/**
 * Finds a relevant image/video for a given event name, via NASA's
 * Image and Video Library (images-api.nasa.gov, no key needed).
 * Cached by event name (not date), since the same event recurs across
 * different birthdates that happen to share a historical event.
 * TODO (later step): wire up the real search call.
 */
export async function getImageForEvent(eventName) {
  if (!eventName) return null;

  const key = `image:${eventName}`;
  const cached = dailyCache.get(key);
  if (cached) return cached;

  // Placeholder — real implementation replaces this.
  const result = null;

  dailyCache.set(key, result);
  return result;
}
