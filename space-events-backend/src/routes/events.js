import { Router } from "express";
import { getAstronomyEvents } from "../modules/astronomy.js";
import { getHistoricalLaunches } from "../modules/launches.js";
import { getHistoricalEvents } from "../modules/historical.js";

import { timed } from "../middleware/timing.js";

const router = Router();

function isValidDate(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(Date.parse(dateStr));
}
router.get("/events", async (req, res) => {
  const { date } = req.query;

  if (!date || !isValidDate(date)) {
    return res.status(400).json({
      error: "Provide a valid 'date' query param in YYYY-MM-DD format.",
    });
  }

  const [astronomyResult, launchesResult, historicalResult] =
    await Promise.allSettled([
      timed(res, "astronomy", () => getAstronomyEvents(date)),
      timed(res, "launches", () => getHistoricalLaunches(date)),
      timed(res, "historical", () => getHistoricalEvents(date)),
    ]);

  const astronomy =
    astronomyResult.status === "fulfilled" ? astronomyResult.value : null;
  const rawLaunches =
    launchesResult.status === "fulfilled" ? launchesResult.value : [];
 

  

  // Tag each launch with whether it happened in the exact birth year,
  // so the frontend can split "on your exact birthday" from "same
  // calendar day, other years."
  const birthYear = date.split("-")[0];
  const launches = rawLaunches.map((launch) => ({
    ...launch,
    isExactYear: Boolean(launch.date?.startsWith(birthYear)),
  }));

  const historical = (
  historicalResult.status === "fulfilled" ? historicalResult.value : []
).map((event) => ({
  ...event,
  isExactYear: event.year === Number(birthYear),
}));


  res.json({
    date,
    astronomy,
    launches,
    historical,
   
  });
});

export default router;
