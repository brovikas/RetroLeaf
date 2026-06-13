import Visit from "../models/Visit.js";

// @desc    Get site visit statistics - total visits and unique IPs
// @route   GET /api/visits/stats
// @access  Public (could be restricted to admin in a real app)
export const getVisitStats = async (req, res, next) => {
  try {
    const totalVisits = await Visit.countDocuments();

    const uniqueIps = await Visit.distinct("ip");

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last24h = await Visit.countDocuments({ createdAt: { $gte: since } });

    res.status(200).json({
      totalVisits,
      uniqueVisitors: uniqueIps.length,
      last24h,
    });
  } catch (error) {
    next(error);
  }
};
