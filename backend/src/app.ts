import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import { prisma } from "./config/database.js";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

const app = express();
app.use(cookieParser());

console.log("🔄 Initializing CodoRium backend...");

// Helmet
app.use(helmet());
console.log("✅ Helmet security middleware enabled");

// CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
console.log(`✅ CORS enabled for: ${env.FRONTEND_URL}`);

// JSON parser
app.use(express.json({ limit: "1mb" }));
console.log("✅ JSON body parser enabled");

// Rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
console.log("✅ Rate limiter enabled: 100 requests / 15 minutes");

// Health check
app.get("/health", async (_req, res) => {
  console.log("🏥 Health check requested");

  try {
    await prisma.$queryRaw`SELECT 1`;

    console.log("✅ Database connection verified");

    res.status(200).json({
      status: "ok",
      service: "codorium-backend",
      database: "connected",
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);

    res.status(503).json({
      status: "error",
      service: "codorium-backend",
      database: "disconnected",
    });
  }
});

console.log("🚀 CodoRium app initialized successfully");



// Routes hai
app.use("/api/v1/auth", authRoutes);
app.use(
  "/api/v1/admin",
  adminRoutes
);

export default app;