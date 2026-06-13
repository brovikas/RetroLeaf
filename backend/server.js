import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import entryRoutes from "./routes/entryRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { generalLimiter } from "./middleware/rateLimitMiddleware.js";
import visitLogger from "./middleware/visitLogger.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- Global Middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); 
app.use(cookieParser()); 

// Apply general rate limiter to all API requests (IP based)
app.use("/api", generalLimiter);

// Log every visit for analytics feature (IP based)
app.use(visitLogger);

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ message: "Retro Journal API is running 📓" });
});

app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/visits", visitRoutes);

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
