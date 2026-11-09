import fs from "fs/promises";
import path from "path";
import axios from "axios";

const client = axios.create({
  baseURL: "https://en.wikipedia.org",
  timeout: 15000,
  headers: {
    "User-Agent": "OnThisDayCelestialApp/1.0 (personal project; contact: smsohail027@gmail.com)",
  },
});

const OUTPUT_PATH = path.resolve("data/spaceflight-on-this-day.json");
const DELAY_MS = 300;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripWikiLinks(text) {
  return text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, display) => display || target);
}

function parseDayWikitext(wikitext) {
  const entries = [];
  const lines = wikitext.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("*")) continue;

    let bulletText = trimmed.replace(/^\*+\s*/, "");
    bulletText = bulletText.replace(/'''/g, ""); // strip bold markup
    bulletText = stripWikiLinks(bulletText);      // resolve [[x|y]] / [[x]]
    bulletText = bulletText.trim();

    const match = bulletText.match(/^(\d{4})\s*[-–]\s*(.+)$/);
    if (!match) continue;

    const [, year, rawText] = match;
    entries.push({ year: Number(year), text: rawText.trim() });
  }

  return entries;
}

async function fetchDayPage(monthName, day, debug = false) {
  const title = `Portal:Spaceflight/On This Day/${day} ${monthName}`;
  const { data } = await client.get("/w/api.php", {
    params: {
      action: "parse",
      page: title,
      format: "json",
      prop: "wikitext",
      formatversion: 2,
    },
    validateStatus: () => true,
  });

  if (debug) {
    console.log("--- RAW API RESPONSE (debug) ---");
    console.log(JSON.stringify(data).slice(0, 800));
    console.log("--- END DEBUG ---");
  }

  if (data.error || !data.parse?.wikitext) return [];
  return parseDayWikitext(data.parse.wikitext);
}

async function scrapeAll() {
  const byDay = {};
  let isFirst = true;

  for (let m = 0; m < 12; m++) {
    const monthName = MONTH_NAMES[m];
    const daysThisMonth = DAYS_IN_MONTH[m];

    for (let day = 1; day <= daysThisMonth; day++) {
      const key = `${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      console.log(`Fetching ${monthName} ${day} (${key})...`);

      try {
        const entries = await fetchDayPage(monthName, day, isFirst);
        isFirst = false;
        byDay[key] = entries;
        console.log(`  -> ${entries.length} entries`);
      } catch (err) {
        console.error(`  Failed for ${key}:`, err.message);
        byDay[key] = [];
      }

      await delay(DELAY_MS);
    }
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(byDay, null, 2));

  const totalEntries = Object.values(byDay).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`\nScrape complete. ${totalEntries} entries across ${Object.keys(byDay).length} days.`);
}

scrapeAll().catch((err) => {
  console.error("Scrape failed:", err.message);
  process.exit(1);
});