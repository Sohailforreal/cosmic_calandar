import * as Astronomy from "astronomy-engine";
import { yearlyCache } from "../config/cache.js";

// Bodies used for conjunction / close-approach detection.
const CONJUNCTION_BODIES = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Moon"];
// Only superior planets (farther from the Sun than Earth) can reach opposition.
const OUTER_PLANETS = ["Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

const DAY_MS = 24 * 60 * 60 * 1000;

// Normalizes an angle difference to the range -180..180.
function normalizeAngleDiff(diff) {
  let d = diff % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

function moonPhaseName(longitude) {
  const names = [
    "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
    "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent",
  ];
  const index = Math.floor((((longitude % 360) + 360) % 360 + 22.5) / 45) % 8;
  return names[index];
}

// Two bodies are "in conjunction" (or a close approach) when their apparent
// ecliptic longitudes, as seen from Earth, are nearly equal.
function findConjunctions(date) {
  const results = [];
  for (let i = 0; i < CONJUNCTION_BODIES.length; i++) {
    for (let j = i + 1; j < CONJUNCTION_BODIES.length; j++) {
      const a = CONJUNCTION_BODIES[i];
      const b = CONJUNCTION_BODIES[j];
      try {
        const diff = Astronomy.PairLongitude(Astronomy.Body[a], Astronomy.Body[b], date);
        const separation = Math.abs(normalizeAngleDiff(diff));
        if (separation <= 5) {
          results.push({ bodies: [a, b], separationDegrees: Number(separation.toFixed(2)) });
        }
      } catch (err) {
        console.error(`PairLongitude failed for ${a}/${b}:`, err.message);
      }
    }
  }
  return results.sort((x, y) => x.separationDegrees - y.separationDegrees);
}

// A superior planet is at opposition when it's ~180° from the Sun as seen
// from Earth (Earth directly between Sun and planet).
function findOppositions(date) {
  const results = [];
  for (const planet of OUTER_PLANETS) {
    try {
      const diff = Astronomy.PairLongitude(Astronomy.Body.Sun, Astronomy.Body[planet], date);
      const distFrom180 = Math.abs(normalizeAngleDiff(diff - 180));
      if (distFrom180 <= 1) {
        results.push({ body: planet, degreesFromExactOpposition: Number(distFrom180.toFixed(2)) });
      }
    } catch (err) {
      console.error(`Opposition check failed for ${planet}:`, err.message);
    }
  }
  return results;
}

// Finds whether the given date falls within ~1 day of a lunar apogee/perigee.
function findLunarApsis(date) {
  try {
    let apsis = Astronomy.SearchLunarApsis(new Date(date.getTime() - 16 * DAY_MS));
    // Walk forward until we bracket the target date between two apsides.
    for (let i = 0; i < 4; i++) {
      if (apsis.time.date >= date) break;
      apsis = Astronomy.NextLunarApsis(apsis);
    }
    const prev = Astronomy.NextLunarApsis(apsis).time.date < apsis.time.date ? apsis : apsis;
    // apsis is now the first one on/after target; get the one before it too.
    const before = Astronomy.SearchLunarApsis(new Date(apsis.time.date.getTime() - 20 * DAY_MS));

    const candidates = [before, apsis];
    let closest = null;
    let closestDiffDays = Infinity;
    for (const c of candidates) {
      const diffDays = Math.abs(c.time.date.getTime() - date.getTime()) / DAY_MS;
      if (diffDays < closestDiffDays) {
        closestDiffDays = diffDays;
        closest = c;
      }
    }

    if (closest && closestDiffDays <= 1) {
      const isPerigee = closest.kind === Astronomy.ApsisKind.Pericenter;
      return {
        kind: isPerigee ? "perigee" : "apogee",
        distanceKm: closest.dist_km != null ? Math.round(closest.dist_km) : null,
        date: closest.time.date.toISOString(),
      };
    }
    return null;
  } catch (err) {
    console.error("Lunar apsis search failed:", err.message);
    return null;
  }
}

// Finds solar/lunar eclipses whose peak falls within ~1 day of the date.
function findEclipses(date) {
  const results = [];
  const searchStart = new Date(date.getTime() - 20 * DAY_MS);

  try {
    const solar = Astronomy.SearchGlobalSolarEclipse(searchStart);
    const diffDays = Math.abs(solar.peak.date.getTime() - date.getTime()) / DAY_MS;
    if (diffDays <= 1) {
      results.push({ type: "solar", kind: solar.kind, peak: solar.peak.date.toISOString() });
    }
  } catch (err) {
    console.error("Solar eclipse search failed:", err.message);
  }

  try {
    if (typeof Astronomy.SearchLunarEclipse === "function") {
      const lunar = Astronomy.SearchLunarEclipse(searchStart);
      const diffDays = Math.abs(lunar.peak.date.getTime() - date.getTime()) / DAY_MS;
      if (diffDays <= 1) {
        results.push({ type: "lunar", kind: lunar.kind, peak: lunar.peak.date.toISOString() });
      }
    }
  } catch (err) {
    console.error("Lunar eclipse search failed:", err.message);
  }

  return results;
}

// Finds whether the date falls within ~1 day of an equinox or solstice.
// Checks the target year plus the boundary years, since a December
// solstice can land within a day of Jan 1 of the following year.
function findEquinoxSolstice(date) {
  const year = date.getUTCFullYear();
  const candidates = [];

  for (const y of [year - 1, year, year + 1]) {
    try {
      const seasons = Astronomy.Seasons(y);
      candidates.push(
        { name: "March Equinox", time: seasons.mar_equinox.date },
        { name: "June Solstice", time: seasons.jun_solstice.date },
        { name: "September Equinox", time: seasons.sep_equinox.date },
        { name: "December Solstice", time: seasons.dec_solstice.date }
      );
    } catch (err) {
      console.error(`Seasons lookup failed for ${y}:`, err.message);
    }
  }

  let closest = null;
  let closestDiffDays = Infinity;
  for (const c of candidates) {
    const diffDays = Math.abs(c.time.getTime() - date.getTime()) / DAY_MS;
    if (diffDays < closestDiffDays) {
      closestDiffDays = diffDays;
      closest = c;
    }
  }

  if (closest && closestDiffDays <= 1) {
    return { name: closest.name, exactTime: closest.time.toISOString() };
  }
  return null;
}

// Peak dates are approximate (they shift by a day or two year to year) —
// checked against a +/-2 day window around each listed peak.
const METEOR_SHOWERS = [
  { name: "Quadrantids", peakMonth: 1, peakDay: 3 },
  { name: "Lyrids", peakMonth: 4, peakDay: 22 },
  { name: "Eta Aquariids", peakMonth: 5, peakDay: 5 },
  { name: "Delta Aquariids", peakMonth: 7, peakDay: 30 },
  { name: "Perseids", peakMonth: 8, peakDay: 12 },
  { name: "Orionids", peakMonth: 10, peakDay: 21 },
  { name: "Leonids", peakMonth: 11, peakDay: 17 },
  { name: "Geminids", peakMonth: 12, peakDay: 14 },
  { name: "Ursids", peakMonth: 12, peakDay: 22 },
];

const METEOR_WINDOW_DAYS = 2;

function findMeteorShower(dateStr) {
  const [, monthStr, dayStr] = dateStr.split("-");
  const month = Number(monthStr);
  const day = Number(dayStr);
  // Use a non-leap reference year so day-of-year math is consistent.
  const target = new Date(Date.UTC(2001, month - 1, day));

  for (const shower of METEOR_SHOWERS) {
    const peak = new Date(Date.UTC(2001, shower.peakMonth - 1, shower.peakDay));
    const diffDays = Math.abs(target.getTime() - peak.getTime()) / DAY_MS;
    // Handle year-wrap (e.g. Dec 31 vs Jan 2) by also checking the
    // distance going the other way around the calendar.
    const wrapDiffDays = 365 - diffDays;
    const minDiff = Math.min(diffDays, wrapDiffDays);

    if (minDiff <= METEOR_WINDOW_DAYS) {
      return { name: shower.name, approxPeak: `${shower.peakMonth}/${shower.peakDay}` };
    }
  }
  return null;
}

export async function getAstronomyEvents(dateStr) {
  const cached = yearlyCache.get(dateStr);
  if (cached) return cached;

  const date = new Date(`${dateStr}T00:00:00Z`);

  const moonLongitude = Astronomy.MoonPhase(date);
  const illumination = Astronomy.Illumination(Astronomy.Body.Moon, date);

  const result = {
    date: dateStr,
    moonPhase: {
      name: moonPhaseName(moonLongitude),
      illuminationPercent: Math.round((illumination.phase_fraction ?? 0) * 100),
    },
    conjunctions: findConjunctions(date),
    oppositions: findOppositions(date),
    eclipses: findEclipses(date),
    apogeePerigee: findLunarApsis(date),
    equinoxSolstice: findEquinoxSolstice(date),
    meteorShower: findMeteorShower(dateStr),
  };

  yearlyCache.set(dateStr, result);
  return result;
}