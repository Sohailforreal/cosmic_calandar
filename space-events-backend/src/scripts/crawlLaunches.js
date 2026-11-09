import fs from "fs/promises";
import path from "path";
import axios from "axios";

const client = axios.create({
  baseURL: "https://ll.thespacedevs.com/2.2.0",
  timeout: 30000, // was 15000 — give slow responses more room
});

const OUTPUT_PATH = path.resolve("data/launches-by-day.json");
const CHECKPOINT_PATH = path.resolve("data/launches-crawl-checkpoint.json");
const PAGE_LIMIT = 100;
const DELAY_BETWEEN_PAGES_MS = 4.5 * 60 * 1000; // ~4.5 min, under 15/hr

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toMonthDayKey(isoDate) {
  const d = new Date(isoDate);
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

function normalizeLaunch(launch) {
  return {
    name: launch.name,
    date: launch.net,
    rocket: launch.rocket?.configuration?.name || null,
    agency: launch.launch_service_provider?.name || null,
    status: launch.status?.name || null,
  };
}

async function loadCheckpoint() {
  try {
    const raw = await fs.readFile(CHECKPOINT_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { offset: 0 };
  }
}

async function loadExistingData() {
  try {
    const raw = await fs.readFile(OUTPUT_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveProgress(byDay, offset) {
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(byDay, null, 2));
  await fs.writeFile(CHECKPOINT_PATH, JSON.stringify({ offset }, null, 2));
}

async function crawlAll() {
  const byDay = await loadExistingData();
  const checkpoint = await loadCheckpoint();
  let offset = checkpoint.offset;
  let total = null;
  let page = Math.floor(offset / PAGE_LIMIT) + 1;

  console.log(`Resuming from offset ${offset}...`);

  while (total === null || offset < total) {
    console.log(`[${new Date().toLocaleTimeString()}] Fetching page ${page} (offset ${offset}${total ? `/${total}` : ""})...`);

    let data;
    try {
      const res = await client.get("/launch/previous/", {
        params: { limit: PAGE_LIMIT, offset, ordering: "net" },
      });
      data = res.data;
    } catch (err) {
      if (err.response?.status === 429) {
        const retryAfter = err.response.headers?.["retry-after"];
        const bodyMsg = err.response.data?.detail;
        console.error(`\nRate limited. ${bodyMsg || ""}`);
        console.error(`Progress saved at offset ${offset}. Wait ${retryAfter ? `${retryAfter}s` : "a while"}, then just re-run this same command — it'll resume automatically.`);
        process.exit(1);
      }
      throw err;
    }

    total = data.count;
    for (const launch of data.results || []) {
      const key = toMonthDayKey(launch.net);
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(normalizeLaunch(launch));
    }

    offset += PAGE_LIMIT;
    page++;
    await saveProgress(byDay, offset);
    console.log(`  -> saved. ${Math.min(offset, total)}/${total} launches processed.`);

    if (offset < total) {
      console.log(`  Waiting ~4.5 min before next page...`);
      await delay(DELAY_BETWEEN_PAGES_MS);
    }
  }

  console.log(`\nCrawl complete. ${total} launches indexed by MM-DD in ${OUTPUT_PATH}`);
  console.log(`Days with data: ${Object.keys(byDay).length}/366`);
}

crawlAll().catch((err) => {
  console.error("Crawl failed:", err.message);
  process.exit(1);
});