const express = require("express");
const session = require('express-session');
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default;
const cors = require('cors'); // Import CORS middleware
const path = require("path");

const userDataRouter = require('./routes/userData.routes');
const authRouter = require('./routes/auth.routes');
const postPrefRouter = require('./routes/postPref.routes');
const recommendationRouter = require('./routes/recommendation.routes');

require('dotenv').config();

// Initialize Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL, // Use full Redis URL
});

redisClient.connect().catch((err) => {
  console.error('Redis connection error:', err);
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Initialize Redis store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "spotify-session:",
});

const app = express();

app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, // Allow requests from this origin
  credentials: true // Allow cookies to be sent with requests
}));

// Simplify middleware for testing
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session({
  store: redisStore,
  secret: 'spotify-recommendation-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to false for local development (Docker)
    httpOnly: true,
    sameSite: 'lax', // Ensure cookies are sent with cross-origin requests
    maxAge: 3600000 // 1 hour
  }
}));

app.use("/", authRouter);
app.use("/api", userDataRouter);
app.use("/api", postPrefRouter);
app.use("/api", recommendationRouter);

app.listen(process.env.BACKEND_PORT || 3000, '0.0.0.0', () => {
  console.log("App is listening on port 3000...");
});

