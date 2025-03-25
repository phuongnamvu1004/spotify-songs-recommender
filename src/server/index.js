const express = require("express");
const session = require('express-session');
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default;
const cors = require('cors'); // Import CORS middleware
const path = require("path");

const apiRouter = require('./routes/api.routes');
const authRouter = require('./routes/auth.routes');

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

// Enable CORS for requests from localhost:5173
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
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

app.use("/api", apiRouter);
app.use("/", authRouter);

app.listen(3000, () => {
  console.log("App is listening on port 3000...");
});

