import express from "express";
import {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
  getStats,
  getRandomEntry,
} from "../controllers/entryController.js";
import protect from "../middleware/authMiddleware.js";
import { createEntryLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// All entry routes require authentication
router.use(protect);

router.route("/").get(getEntries).post(createEntryLimiter, createEntry);

// Specific routes must come before the dynamic /:id route
router.get("/stats", getStats);
router.get("/random", getRandomEntry);

router.route("/:id").get(getEntryById).put(updateEntry).delete(deleteEntry);

export default router;
