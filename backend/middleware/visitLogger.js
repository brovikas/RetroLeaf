import Visit from "../models/Visit.js";

// Logs a visit per IP, but only once every 30 minutes to avoid
// counting every single API call as a separate visit.
const visitLogger = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  const THIRTY_MIN = 2 * 60 * 1000;
  const cutoff = new Date(Date.now() - THIRTY_MIN);

  Visit.findOne({ ip, createdAt: { $gte: cutoff } })
    .then((recent) => {
      if (!recent) {
        return Visit.create({
          ip,
          path: req.originalUrl,
          userAgent: req.headers["user-agent"] || "",
        });
      }
    })
    .catch((err) => console.error("Visit log error:", err.message));

  next();
};

export default visitLogger;