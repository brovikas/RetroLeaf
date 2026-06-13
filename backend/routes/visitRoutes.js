import express from "express";
import { getVisitStats } from "../controllers/visitController.js";

const router = express.Router();

router.get("/stats", getVisitStats);

export default router;
