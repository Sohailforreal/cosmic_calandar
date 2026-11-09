/**
 * Basic request timing middleware. Logs how long each request took,
 * plus a helper (attached to res.locals) that individual modules can use
 * to time their own slice of the work (astronomy vs launches vs images),
 * so we can see which module is actually the bottleneck before optimizing
 * blindly.
 */
export function timingMiddleware(req, res, next) {
  const start = process.hrtime.bigint();
  res.locals.moduleTimings = {};

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const totalMs = Number(end - start) / 1_000_000;
    const breakdown = Object.entries(res.locals.moduleTimings)
      .map(([name, ms]) => `${name}=${ms.toFixed(1)}ms`)
      .join(" ");
    console.log(
      `[${req.method}] ${req.originalUrl} -> ${totalMs.toFixed(1)}ms total ${breakdown ? `(${breakdown})` : ""}`
    );
  });

  next();
}

// Call this inside a module with a label, wrapping an async function,
// and it records how long that specific piece took onto res.locals.
export async function timed(res, label, fn) {
  const start = process.hrtime.bigint();
  try {
    return await fn();
  } finally {
    const end = process.hrtime.bigint();
    res.locals.moduleTimings[label] = Number(end - start) / 1_000_000;
  }
}
