import express from "express";
import session from "express-session";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import userDataRouter from "./routes/userData.routes.js";
import authRouter from "./routes/auth.routes.js";
import preferencesRouter from "./routes/preferences.routes.js";
import recommendationRouter from "./routes/recommendation.routes.js";
import dotenv from "dotenv";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

console.log("[ENV DEBUG] REDIRECT_URI:", process.env.REDIRECT_URI);
console.log("[ENV DEBUG] FRONTEND_URL:", process.env.FRONTEND_URL);


// Initialize Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch((err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

// Initialize Redis store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "spotify-session:",
});

const app = express();

// CORS config
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.set("trust proxy", 1);

app.use(
  session({
    store: redisStore,
    secret: "spotify-recommendation-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000,
    },
  })
);

// Routes
app.use("/", authRouter);
app.use("/api", userDataRouter);
app.use("/api", preferencesRouter);
app.use("/api", recommendationRouter);

// Start server
const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`App is listening on port ${PORT}...`);
});
