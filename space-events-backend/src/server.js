import express from "express";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import eventsRouter from "./routes/events.js";
import { timingMiddleware } from "./middleware/timing.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(compression());
app.use(timingMiddleware);

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", eventsRouter);

app.listen(PORT, () => {
  console.log(`Space Events backend running on http://localhost:${PORT}`);
});