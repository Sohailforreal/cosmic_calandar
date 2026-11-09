import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.resolve("data/spaceflight-on-this-day.json");

let historicalByDay = null;

async function loadData() {
  if (historicalByDay) return historicalByDay;
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  historicalByDay = JSON.parse(raw);
  return historicalByDay;
}

function toMonthDayKey(dateStr) {
  const [, month, day] = dateStr.split("-");
  return `${month}-${day}`;
}

export async function getHistoricalEvents(dateStr) {
  const data = await loadData();
  const key = toMonthDayKey(dateStr);
  const entries = data[key] || [];

  
  return entries
    .map((e) => ({ year: e.year, title: e.text }))
    .sort((a, b) => a.year - b.year);
}