import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.resolve("data/launches-by-day.json");

let launchesByDay = null;

async function loadData() {
  if (launchesByDay) return launchesByDay;
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  launchesByDay = JSON.parse(raw);
  return launchesByDay;
}

function toMonthDayKey(dateStr) {
  const [, month, day] = dateStr.split("-");
  return `${month}-${day}`;
}

export async function getHistoricalLaunches(dateStr) {
  const data = await loadData();
  const key = toMonthDayKey(dateStr);
  return data[key] || [];
}