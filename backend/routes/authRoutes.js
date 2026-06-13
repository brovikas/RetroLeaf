import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Auth routes use a stricter rate limiter to prevent brute force attacks
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;
