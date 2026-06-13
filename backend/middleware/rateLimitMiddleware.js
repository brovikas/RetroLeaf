import rateLimit from "express-rate-limit";

// General API limiter - applies to all requests, tracked per IP
export const generalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true, 
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP, please try again after some time.",
  },
});

//  limiter for auth routes (login/register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts from this IP. Please try again after 15 minutes.",
  },
});

// Limiter for entry 
export const createEntryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "You're creating entries too quickly. Please slow down.",
  },
});
